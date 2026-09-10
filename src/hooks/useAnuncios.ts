import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { distanciaEmKm } from '@/lib/geocoding'

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
  latitude: number | null
  longitude: number | null
  /** Preenchido no navegador quando a busca tem uma localização de origem. */
  distanciaKm?: number
}

export interface FiltrosBusca {
  busca?: string
  categoria?: string
  subcategoria?: string
  estado?: string
  cidade?: string
  precoMin?: number
  precoMax?: number
  ordenar?: 'recentes' | 'menor_preco' | 'maior_preco' | 'distancia'
  /** Coordenadas de onde a pessoa está buscando (GPS ou endereço digitado). */
  origemLat?: number
  origemLng?: number
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

      let resultado = (data ?? []) as Anuncio[]

      if (filtros.origemLat !== undefined && filtros.origemLng !== undefined) {
        const origem = { latitude: filtros.origemLat, longitude: filtros.origemLng }

        resultado = resultado.map((anuncio) =>
          anuncio.latitude !== null && anuncio.longitude !== null
            ? {
                ...anuncio,
                distanciaKm: distanciaEmKm(origem, {
                  latitude: anuncio.latitude,
                  longitude: anuncio.longitude,
                }),
              }
            : anuncio,
        )

        if (filtros.ordenar === 'distancia') {
          resultado = [...resultado].sort((a, b) => {
            if (a.distanciaKm === undefined) return 1
            if (b.distanciaKm === undefined) return -1
            return a.distanciaKm - b.distanciaKm
          })
        }
      }

      setAnuncios(resultado)
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