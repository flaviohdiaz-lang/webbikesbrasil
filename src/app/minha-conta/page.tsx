'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { formatarPreco, formatarData } from '@/lib/categorias'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Anuncio {
  id: string
  created_at: string
  titulo: string
  categoria: string
  subcategoria: string
  preco: number
  cidade: string
  estado: string
  foto_url: string
}

export default function MinhaConta() {
  const { user, isLoaded } = useUser()
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [excluindo, setExcluindo] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    buscarMeusAnuncios()
  }, [user])

  async function buscarMeusAnuncios() {
    setLoading(true)
    const { data } = await supabase
      .from('anuncios')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    setAnuncios(data ?? [])
    setLoading(false)
  }

  async function excluirAnuncio(id: string) {
    const confirmar = window.confirm('Tem certeza que deseja excluir este anuncio?')
    if (!confirmar) return

    setExcluindo(id)
    await supabase.from('anuncios').delete().eq('id', id)
    setAnuncios(prev => prev.filter(a => a.id !== id))
    setExcluindo(null)
  }

  if (!isLoaded) return null

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Voce precisa estar logado para acessar esta pagina.</p>
        <Link href="/sign-in" className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-800">
          Entrar
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Minha conta</h1>
          <p className="text-sm text-gray-400 mt-1">{user.emailAddresses[0].emailAddress}</p>
        </div>
        <Link
          href="/anuncios/novo"
          className="h-9 px-4 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
        >
          + Novo anuncio
        </Link>
      </div>

      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Meus anuncios {!loading && `(${anuncios.length})`}
      </h2>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && anuncios.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 mb-4">Voce ainda nao tem nenhum anuncio.</p>
          <Link
            href="/anuncios/novo"
            className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-800"
          >
            Criar primeiro anuncio
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {anuncios.map(anuncio => (
          <div
            key={anuncio.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center hover:border-gray-200 transition-colors"
          >
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              {anuncio.foto_url ? (
                <Image
                  src={anuncio.foto_url}
                  alt={anuncio.titulo}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-green-700 font-medium uppercase tracking-wide">
                {anuncio.categoria}{anuncio.subcategoria ? ' · ' + anuncio.subcategoria : ''}
              </p>
              <h3 className="font-medium text-gray-900 truncate mt-0.5">{anuncio.titulo}</h3>
              <p className="text-lg font-semibold text-gray-900">{formatarPreco(anuncio.preco)}</p>
              <p className="text-xs text-gray-400">{anuncio.cidade}, {anuncio.estado} · {formatarData(anuncio.created_at)}</p>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link
                href={'/anuncios/' + anuncio.id}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-center"
              >
                Ver
              </Link>
              <button
                onClick={() => excluirAnuncio(anuncio.id)}
                disabled={excluindo === anuncio.id}
                className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 disabled:opacity-40"
              >
                {excluindo === anuncio.id ? '...' : 'Excluir'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}