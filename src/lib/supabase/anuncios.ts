import { createSupabaseAdmin, isSupabaseConfigured, type AnuncioRow } from "@/lib/supabase/server";

export type Anuncio = AnuncioRow & {
  id: string;
  created_at: string;
};

export async function fetchAnuncios(): Promise<Anuncio[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("anuncios")
    .select(
      "id, titulo, categoria, subcategoria, descricao, preco, cidade, estado, foto_url, foto_url2, foto_url3, whatsapp, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchAnuncios]", error.message);
    throw new Error(error.message);
  }

  return (data ?? []) as Anuncio[];
}

export async function fetchAnuncioById(id: string): Promise<Anuncio | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("anuncios")
    .select(
      "id, titulo, categoria, subcategoria, descricao, preco, cidade, estado, foto_url, foto_url2, foto_url3, whatsapp, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[fetchAnuncioById]", error.message);
    throw new Error(error.message);
  }

  return (data as Anuncio | null) ?? null;
}

export function getAnuncioPhotos(anuncio: Anuncio): string[] {
  return [anuncio.foto_url, anuncio.foto_url2, anuncio.foto_url3].filter(
    (url): url is string => Boolean(url),
  );
}
