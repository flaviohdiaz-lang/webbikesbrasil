import { NextResponse } from "next/server";
import { geocodificarEndereco } from "@/lib/geocoding";
import { createSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
// Evita que o Next tente pré-processar essa rota em build; ela só roda quando
// alguém acessa a URL manualmente com a senha correta.
export const dynamic = "force-dynamic";
// Dá mais tempo para essa tarefa rodar (o Vercel encerraria uma função comum
// depois de alguns segundos, e essa aqui pode demorar mais por causa da
// pausa entre cada consulta ao serviço de geolocalização).
export const maxDuration = 60;

// Quantos anúncios processar por vez. Se houver mais do que isso pendente,
// é só acessar a mesma URL de novo (o site sempre pega os próximos que ainda
// não têm localização) até a resposta mostrar "restantes": 0.
const LOTE = 40;

/**
 * Tarefa administrativa única: preenche latitude/longitude dos anúncios que
 * ainda não têm essa informação (publicados antes da busca por localização
 * existir). Protegida por uma senha (ADMIN_BACKFILL_SECRET) para que só o
 * dono do site consiga executar, acessando a URL uma vez pelo navegador:
 *
 *   https://www.webbikesbrasil.com/api/admin/geocode-backfill?senha=SUA_SENHA
 */
export async function GET(request: Request) {
  const secret = process.env.ADMIN_BACKFILL_SECRET;
  const senhaFornecida = new URL(request.url).searchParams.get("senha");

  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_BACKFILL_SECRET não configurado no servidor." },
      { status: 500 },
    );
  }

  if (!senhaFornecida || senhaFornecida !== secret) {
    return NextResponse.json({ error: "Senha inválida." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado." },
      { status: 503 },
    );
  }

  const supabase = createSupabaseAdmin();

  const { data: anuncios, error, count } = await supabase
    .from("anuncios")
    .select("id, cidade, estado", { count: "exact" })
    .is("latitude", null)
    .limit(LOTE);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resultados: Array<{ id: string; status: string }> = [];

  for (const anuncio of anuncios ?? []) {
    // Respeita o limite de uso do serviço gratuito de geolocalização
    // (no máximo 1 pedido por segundo).
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const coordenadas = await geocodificarEndereco(
      `${anuncio.cidade}, ${anuncio.estado}, Brasil`,
    );

    if (!coordenadas) {
      resultados.push({ id: anuncio.id, status: "não encontrado" });
      continue;
    }

    const { error: updateError } = await supabase
      .from("anuncios")
      .update({
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
      })
      .eq("id", anuncio.id);

    resultados.push({
      id: anuncio.id,
      status: updateError ? `erro: ${updateError.message}` : "atualizado",
    });
  }

  const restantes = Math.max((count ?? resultados.length) - resultados.length, 0);

  return NextResponse.json({
    processados: resultados.length,
    restantes,
    dica:
      restantes > 0
        ? "Ainda há anúncios sem localização. Acesse esta mesma URL de novo para continuar."
        : "Todos os anúncios já têm localização preenchida!",
    resultados,
  });
}
