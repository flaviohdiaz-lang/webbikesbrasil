import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Anuncio {
  id: string
  created_at: string
  titulo: string
  categoria: string
  subcategoria: string
  descricao: string
  preco: number
  cidade: string
  estado: string
  foto_url: string
  foto_url2: string
  foto_url3: string
  whatsapp: string
  user_id: string
}

export interface FiltrosBusca {
  busca?: string
  categoria?: string
  subcategoria?: string
  estado?: string
  cidade?: string
  precoMin?: number
  precoMax?: number
  ordenar?: 'recentes' | 'menor_preco' | 'maior_preco'
}

export function useAnuncios(filtros: FiltrosBusca) {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    setLoading(true)
    setErro(null)

    try {
      let query = supabase
        .from('anuncios')
        .select('*', { count: 'exact' })

      if (filtros.busca) {
        query = query.ilike('titulo', `%${filtros.busca}%`)
      }
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria)
      }
      if (filtros.subcategoria) {
        query = query.eq('subcategoria', filtros.subcategoria)
      }
      if (filtros.estado) {
        query = query.eq('estado', filtros.estado)
      }
      if (filtros.cidade) {
        query = query.ilike('cidade', `%${filtros.cidade}%`)
      }
      if (filtros.precoMin !== undefined) {
        query = query.gte('preco', filtros.precoMin)
      }
      if (filtros.precoMax !== undefined) {
        query = query.lte('preco', filtros.precoMax)
      }

      switch (filtros.ordenar) {
        case 'menor_preco':
          query = query.order('preco', { ascending: true })
          break
        case 'maior_preco':
          query = query.order('preco', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, count, error } = await query

      if (error) throw error

      setAnuncios(data ?? [])
      setTotal(count ?? 0)
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao buscar anúncios')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filtros)])

  useEffect(() => {
    buscar()
  }, [buscar])

  return { anuncios, total, loading, erro, refetch: buscar }
}