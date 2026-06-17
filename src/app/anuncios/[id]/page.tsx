import AnuncioGallery from "@/components/AnuncioGallery";
import AnuncioWhatsAppButton from "@/components/AnuncioWhatsAppButton";
import NavbarLogo from "@/components/NavbarLogo";
import { formatBrazilianCurrency } from "@/lib/currency";
import {
  fetchAnuncioById,
  getAnuncioPhotos,
} from "@/lib/supabase/anuncios";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type AnuncioDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AnuncioDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return { title: "Anúncio — Web Bikes Brasil" };
  }

  try {
    const anuncio = await fetchAnuncioById(id);
    if (!anuncio) {
      return { title: "Anúncio não encontrado — Web Bikes Brasil" };
    }

    return {
      title: `${anuncio.titulo} — Web Bikes Brasil`,
      description: anuncio.descricao.slice(0, 160),
    };
  } catch {
    return { title: "Anúncio — Web Bikes Brasil" };
  }
}

export default async function AnuncioDetailPage({ params }: AnuncioDetailPageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    notFound();
  }

  let anuncio;

  try {
    anuncio = await fetchAnuncioById(id);
  } catch {
    notFound();
  }

  if (!anuncio) {
    notFound();
  }

  const photos = getAnuncioPhotos(anuncio);
  const preco = Number(anuncio.preco);
  const precoFormatado = formatBrazilianCurrency(preco);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />

      <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/anuncios"
            className="text-sm font-medium text-emerald-100 transition hover:text-white"
          >
            ← Voltar aos anúncios
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <AnuncioGallery photos={photos} title={anuncio.titulo} />

          <div className="flex flex-col rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                {anuncio.categoria}
              </span>
              {anuncio.subcategoria && (
                <span className="rounded-full border border-yellow-400 bg-blue-950 px-3 py-1 text-xs font-semibold text-yellow-100">
                  {anuncio.subcategoria}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {anuncio.titulo}
            </h1>

            <p className="mt-4 text-3xl font-extrabold text-emerald-600">
              {precoFormatado}
            </p>

            <p className="mt-3 text-sm text-gray-600">
              📍 {anuncio.cidade}, {anuncio.estado}
            </p>

            <div className="mt-6 border-t border-emerald-100 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Descrição
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 sm:text-base">
                {anuncio.descricao}
              </p>
            </div>

            <div className="mt-8 border-t border-emerald-100 pt-6">
              {anuncio.whatsapp && (
                <AnuncioWhatsAppButton
                  whatsapp={anuncio.whatsapp}
                  titulo={anuncio.titulo}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
