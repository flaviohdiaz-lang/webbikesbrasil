import type { Anuncio } from "@/lib/supabase/anuncios";
import { formatBrazilianCurrency } from "@/lib/currency";
import Image from "next/image";
import Link from "next/link";

type AnuncioCardProps = {
  anuncio: Anuncio;
};

export default function AnuncioCard({ anuncio }: AnuncioCardProps) {
  const preco = Number(anuncio.preco);
  const subcategoria = anuncio.subcategoria ?? anuncio.categoria;

  return (
    <Link
      href={`/anuncios/${anuncio.id}`}
      className="group block h-full no-underline"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm transition group-hover:border-yellow-400 group-hover:shadow-md">
        <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-yellow-100">
          {anuncio.foto_url ? (
            <Image
              src={anuncio.foto_url}
              alt={anuncio.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">
              🚲
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col border-t-4 border-yellow-400 bg-gradient-to-b from-white to-emerald-50/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {subcategoria}
          </p>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold text-gray-900">
            {anuncio.titulo}
          </h3>
          <p className="mt-2 text-xl font-extrabold text-emerald-600">
            {formatBrazilianCurrency(preco)}
          </p>
          <p className="mt-auto pt-3 text-sm text-gray-600">
            📍 {anuncio.cidade}, {anuncio.estado}
          </p>
        </div>
      </article>
    </Link>
  );
}
