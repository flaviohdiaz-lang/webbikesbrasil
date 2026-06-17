import { createClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export type AnuncioRow = {
  titulo: string;
  categoria: string;
  subcategoria: string | null;
  descricao: string;
  preco: number;
  cidade: string;
  estado: string;
  foto_url: string | null;
  foto_url2: string | null;
  foto_url3: string | null;
  whatsapp: string | null;
};

export const ANUNCIOS_STORAGE_BUCKET = "anuncios";
