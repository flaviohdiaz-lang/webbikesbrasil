'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import FiltrosBusca from '@/components/FiltrosBusca'
import { useAnuncios, FiltrosBusca as TFiltros } from '@/hooks/useAnuncios'
import { formatarPreco, formatarData } from '@/lib/categorias'

function CardAnuncio({ anuncio }: { anuncio: ReturnType<typeof useAnuncios>['anuncios'][0] }) {
  return (
    <Link
      href={`/anuncios/${anuncio.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col"
    >
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {anuncio.foto_url ? (
          <Image
            src={anuncio.foto_url}
            alt={anuncio.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full border border-green-100">
          {anuncio.categoria}
          {anuncio.subcategoria && ` · ${anuncio.subcategoria}`}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-green-700 transition-colors">
          {anuncio.titulo}
        </h3>
        <p className="text-lg font-semibold text-gray-900 mt-auto pt-2">
          {formatarPreco(anuncio.preco)}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {anuncio.cidade}, {anuncio.estado}
          </span>
          <span className="text-[10px] text-gray-300">
            {formatarData(anuncio.created_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-6 bg-gray-100 rounded w-1/3 mt-2" />
      </div>
    </div>
  )
}

function EstadoVazio({ filtrosAtivos }: { filtrosAtivos: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-gray-500 font-medium">
        {filtrosAtivos ? 'Nenhum anúncio encontrado' : 'Sem anúncios por aqui ainda'}
      </p>
      <p className="text-sm text-gray-400 mt-1">
        {filtrosAtivos ? 'Tente ajustar os filtros ou ampliar a busca' : 'Seja o primeiro a anunciar!'}
      </p>
      {filtrosAtivos && (
        <Link href="/anuncios" className="mt-4 text-sm text-green-700 underline underline-offset-2 hover:text-green-800">
          Limpar todos os filtros
        </Link>
      )}
    </div>
  )
}

export default function AnunciosPage() {
  const params = useSearchParams()

  const [filtros, setFiltros] = useState<TFiltros>({
    busca: params.get('busca') ?? undefined,
    categoria: params.get('categoria') ?? undefined,
    subcategoria: params.get('subcategoria') ?? undefined,
    estado: params.get('estado') ?? undefined,
    cidade: params.get('cidade') ?? undefined,
    precoMin: params.get('precoMin') ? Number(params.get('precoMin')) : undefined,
    precoMax: params.get('precoMax') ? Number(params.get('precoMax')) : undefined,
    ordenar: (params.get('ordenar') as TFiltros['ordenar']) ?? 'recentes',
  })

  const { anuncios, total, loading, erro } = useAnuncios(filtros)
  const temFiltros = Object.values(filtros).some(v => v !== undefined && v !== 'recentes')

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Anúncios</h1>
        <Link
          href="/anuncios/novo"
          className="h-9 px-4 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Anunciar
        </Link>
      </div>

      <FiltrosBusca onChange={setFiltros} />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          {loading ? 'Buscando...' : `${total} anúncio${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
        </span>
        <select
          value={filtros.ordenar ?? 'recentes'}
          onChange={e => setFiltros(f => ({ ...f, ordenar: e.target.value as TFiltros['ordenar'] }))}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20"
        >
          <option value="recentes">Mais recentes</option>
          <option value="menor_preco">Menor preço</option>
          <option value="maior_preco">Maior preço</option>
        </select>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : anuncios.length === 0
          ? <EstadoVazio filtrosAtivos={temFiltros} />
          : anuncios.map(a => <CardAnuncio key={a.id} anuncio={a} />)
        }
      </div>
    </main>
  )
}