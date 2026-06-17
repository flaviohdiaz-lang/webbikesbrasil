import AnuncioCard from "@/components/AnuncioCard";
import NavbarLogo from "@/components/NavbarLogo";
import { fetchAnuncios, type Anuncio } from "@/lib/supabase/anuncios";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Anúncios — Web Bikes Brasil",
  description: "Veja todos os anúncios de bikes, peças, acessórios e mais.",
};

export const dynamic = "force-dynamic";

export default async function AnunciosPage() {
  let anuncios: Anuncio[] = [];
  let errorMessage: string | null = null;

  if (!isSupabaseConfigured()) {
    errorMessage = "Supabase não configurado. Verifique o .env.local.";
  } else {
    try {
      anuncios = await fetchAnuncios();
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? `Erro ao carregar anúncios: ${error.message}`
          : "Erro ao carregar anúncios.";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />

      <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-100 transition hover:text-white"
          >
            ← Voltar ao início
          </Link>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Anúncios
              </h1>
              <p className="mt-2 max-w-xl text-emerald-50">
                Bikes, peças, acessórios, serviços e eventos publicados pela
                comunidade Web Bikes Brasil.
              </p>
            </div>
            <Link
              href="/anunciar"
              className="rounded-lg border-2 border-yellow-400 bg-blue-950 px-4 py-2 text-sm font-bold text-yellow-100 transition hover:bg-blue-900"
            >
              + Anunciar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {errorMessage && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        {!errorMessage && anuncios.length === 0 && (
          <div className="rounded-2xl border border-dashed border-emerald-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-gray-900">
              Nenhum anúncio publicado ainda
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Seja o primeiro a anunciar no Web Bikes Brasil.
            </p>
            <Link
              href="/anunciar"
              className="mt-6 inline-block rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105"
            >
              Criar anúncio
            </Link>
          </div>
        )}

        {anuncios.length > 0 && (
          <>
            <p className="mb-6 text-sm text-gray-600">
              {anuncios.length}{" "}
              {anuncios.length === 1 ? "anúncio encontrado" : "anúncios encontrados"}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {anuncios.map((anuncio) => (
                <AnuncioCard key={anuncio.id} anuncio={anuncio} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
