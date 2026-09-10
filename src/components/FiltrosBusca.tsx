'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ESTADOS } from '@/lib/categorias'
import { listingSubcategories, listingTypes } from '@/data/listing-form'
import { formatBrazilianCurrencyInput, parseBrazilianCurrency } from '@/lib/currency'
import { FiltrosBusca as TFiltros } from '@/hooks/useAnuncios'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

async function geocodificarNoNavegador(
  texto: string,
): Promise<{ lat: number; lng: number } | null> {
  const query = texto.trim()
  if (!query) return null

  try {
    const url = new URL(NOMINATIM_URL)
    url.searchParams.set('q', `${query}, Brasil`)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '1')
    url.searchParams.set('countrycodes', 'br')

    const response = await fetch(url.toString(), {
      headers: { 'Accept-Language': 'pt-BR' },
    })
    if (!response.ok) return null

    const data = (await response.json()) as Array<{ lat: string; lon: string }>
    const first = data[0]
    if (!first) return null

    const lat = Number(first.lat)
    const lng = Number(first.lon)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null

    return { lat, lng }
  } catch {
    return null
  }
}

interface Props {
  onChange: (filtros: TFiltros) => void
}

// Arredonda a coordenada para nível de bairro/cidade (evita expor o endereço
// exato de quem está buscando, seja por GPS ou por endereço digitado).
function arredondarCoordenada(valor: number): number {
  return Math.round(valor * 100) / 100
}

function precoParaMascara(valor: string | null): string {
  if (!valor) return ''
  const numero = Number(valor)
  if (Number.isNaN(numero)) return ''
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function FiltrosBusca({ onChange }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const [busca, setBusca] = useState(params.get('busca') ?? '')
  const [categoria, setCategoria] = useState(params.get('categoria') ?? '')
  const [subcategoria, setSubcategoria] = useState(params.get('subcategoria') ?? '')
  const [estado, setEstado] = useState(params.get('estado') ?? '')
  const [cidade, setCidade] = useState(params.get('cidade') ?? '')
  const [precoMin, setPrecoMin] = useState(precoParaMascara(params.get('precoMin')))
  const [precoMax, setPrecoMax] = useState(precoParaMascara(params.get('precoMax')))
  const [ordenar, setOrdenar] = useState<TFiltros['ordenar']>(
    (params.get('ordenar') as TFiltros['ordenar']) ?? 'recentes'
  )

  const [localizacaoTexto, setLocalizacaoTexto] = useState(params.get('local') ?? '')
  const [origemLat, setOrigemLat] = useState<number | undefined>(
    params.get('origemLat') ? Number(params.get('origemLat')) : undefined
  )
  const [origemLng, setOrigemLng] = useState<number | undefined>(
    params.get('origemLng') ? Number(params.get('origemLng')) : undefined
  )
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false)
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null)

  const subcategorias = categoria
    ? listingSubcategories[categoria as keyof typeof listingSubcategories] ?? []
    : []

  function aplicar() {
    const filtros: TFiltros = {
      busca: busca || undefined,
      categoria: categoria || undefined,
      subcategoria: subcategoria || undefined,
      estado: estado || undefined,
      cidade: cidade || undefined,
      precoMin: precoMin ? parseBrazilianCurrency(precoMin) : undefined,
      precoMax: precoMax ? parseBrazilianCurrency(precoMax) : undefined,
      ordenar,
      origemLat,
      origemLng,
    }

    const q = new URLSearchParams()
    if (filtros.busca) q.set('busca', filtros.busca)
    if (filtros.categoria) q.set('categoria', filtros.categoria)
    if (filtros.subcategoria) q.set('subcategoria', filtros.subcategoria)
    if (filtros.estado) q.set('estado', filtros.estado)
    if (filtros.cidade) q.set('cidade', filtros.cidade)
    if (filtros.precoMin) q.set('precoMin', String(filtros.precoMin))
    if (filtros.precoMax) q.set('precoMax', String(filtros.precoMax))
    if (filtros.ordenar && filtros.ordenar !== 'recentes') q.set('ordenar', filtros.ordenar)
    if (origemLat !== undefined && origemLng !== undefined) {
      q.set('origemLat', String(origemLat))
      q.set('origemLng', String(origemLng))
      if (localizacaoTexto) q.set('local', localizacaoTexto)
    }

    router.push('/anuncios?' + q.toString(), { scroll: false })
    onChange(filtros)
  }

  function limpar() {
    setBusca('')
    setCategoria('')
    setSubcategoria('')
    setEstado('')
    setCidade('')
    setPrecoMin('')
    setPrecoMax('')
    setOrdenar('recentes')
    setLocalizacaoTexto('')
    setOrigemLat(undefined)
    setOrigemLng(undefined)
    setErroLocalizacao(null)
    router.push('/anuncios', { scroll: false })
    onChange({})
  }

  function removerFiltro(chave: keyof TFiltros | 'local') {
    if (chave === 'busca') setBusca('')
    if (chave === 'categoria') { setCategoria(''); setSubcategoria('') }
    if (chave === 'subcategoria') setSubcategoria('')
    if (chave === 'estado') setEstado('')
    if (chave === 'cidade') setCidade('')
    if (chave === 'precoMin') setPrecoMin('')
    if (chave === 'precoMax') setPrecoMax('')
    if (chave === 'local') {
      setLocalizacaoTexto('')
      setOrigemLat(undefined)
      setOrigemLng(undefined)
      if (ordenar === 'distancia') setOrdenar('recentes')
    }
    setTimeout(aplicar, 0)
  }

  async function buscarPorEndereco() {
    if (!localizacaoTexto.trim()) return
    setBuscandoLocalizacao(true)
    setErroLocalizacao(null)

    const resultado = await geocodificarNoNavegador(localizacaoTexto)

    setBuscandoLocalizacao(false)

    if (!resultado) {
      setErroLocalizacao('Não encontramos essa localização. Tente digitar de outra forma, ex.: "Campinas, SP".')
      return
    }

    setOrigemLat(arredondarCoordenada(resultado.lat))
    setOrigemLng(arredondarCoordenada(resultado.lng))
    setOrdenar('distancia')
    setTimeout(aplicar, 0)
  }

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      setErroLocalizacao('Seu navegador não permite compartilhar localização.')
      return
    }

    setBuscandoLocalizacao(true)
    setErroLocalizacao(null)

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        setBuscandoLocalizacao(false)
        setOrigemLat(arredondarCoordenada(posicao.coords.latitude))
        setOrigemLng(arredondarCoordenada(posicao.coords.longitude))
        setOrdenar('distancia')
        setTimeout(aplicar, 0)
      },
      () => {
        setBuscandoLocalizacao(false)
        setErroLocalizacao('Não conseguimos acessar sua localização. Verifique a permissão do navegador.')
      },
      { enableHighAccuracy: false, timeout: 10000 },
    )
  }

  const tagsFiltros = [
    origemLat !== undefined
      ? { label: '📍 Próximo de ' + (localizacaoTexto || 'você'), chave: 'local' as const }
      : null,
    busca ? { label: '"' + busca + '"', chave: 'busca' as const } : null,
    categoria ? { label: categoria, chave: 'categoria' as const } : null,
    subcategoria ? { label: subcategoria, chave: 'subcategoria' as const } : null,
    estado ? { label: estado, chave: 'estado' as const } : null,
    cidade ? { label: cidade, chave: 'cidade' as const } : null,
    precoMin
      ? {
          label:
            'A partir de R$ ' +
            parseBrazilianCurrency(precoMin).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          chave: 'precoMin' as const,
        }
      : null,
    precoMax
      ? {
          label:
            'Ate R$ ' +
            parseBrazilianCurrency(precoMax).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          chave: 'precoMax' as const,
        }
      : null,
  ].filter(Boolean) as { label: string; chave: keyof TFiltros | 'local' }[]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 flex-[2] min-w-[180px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Busca</label>
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && aplicar()}
            placeholder="Bicicleta, peça, acessório..."
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-green-600"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Categoria</label>
          <select
            value={categoria}
            onChange={e => { setCategoria(e.target.value); setSubcategoria('') }}
            className="h-9 rounded-lg border border-gray-200 px-2 text-sm bg-white focus:outline-none focus:border-green-600"
          >
            <option value="">Todas</option>
            {listingTypes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Tipo</label>
          <select
            value={subcategoria}
            onChange={e => setSubcategoria(e.target.value)}
            disabled={!categoria}
            className="h-9 rounded-lg border border-gray-200 px-2 text-sm bg-white focus:outline-none focus:border-green-600 disabled:opacity-40"
          >
            <option value="">Todos</option>
            {subcategorias.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[80px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Estado</label>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 px-2 text-sm bg-white focus:outline-none focus:border-green-600"
          >
            <option value="">UF</option>
            {ESTADOS.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Cidade</label>
          <input
            type="text"
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && aplicar()}
            placeholder="ex: Sao Paulo"
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-green-600"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-end mt-3">
        <div className="flex flex-col gap-1 flex-[2] min-w-[220px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Localização</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={localizacaoTexto}
              onChange={e => setLocalizacaoTexto(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarPorEndereco()}
              placeholder="Cidade, rua ou endereço..."
              disabled={buscandoLocalizacao}
              className="h-9 flex-1 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-green-600 disabled:opacity-60"
            />
          </div>
          {erroLocalizacao && (
            <p className="text-xs text-red-600 mt-0.5">{erroLocalizacao}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Preco min.</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={precoMin}
              onChange={e => setPrecoMin(formatBrazilianCurrencyInput(e.target.value))}
              onKeyDown={e => e.key === 'Enter' && aplicar()}
              placeholder="0,00"
              className="h-9 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-sm focus:outline-none focus:border-green-600"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Preco max.</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={precoMax}
              onChange={e => setPrecoMax(formatBrazilianCurrencyInput(e.target.value))}
              onKeyDown={e => e.key === 'Enter' && aplicar()}
              placeholder="50.000,00"
              className="h-9 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-sm focus:outline-none focus:border-green-600"
            />
          </div>
        </div>

        <div className="flex gap-2 ml-auto items-end">
          {tagsFiltros.length > 0 && (
            <button
              onClick={limpar}
              className="h-9 px-4 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50"
            >
              Limpar
            </button>
          )}
          <button
            type="button"
            onClick={usarMinhaLocalizacao}
            disabled={buscandoLocalizacao}
            className="h-9 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60 whitespace-nowrap"
            title="Usar minha localização atual"
          >
            📍 {buscandoLocalizacao ? 'Buscando...' : 'Próximo de mim'}
          </button>
          <button
            onClick={aplicar}
            className="h-9 px-5 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 flex items-center gap-2"
          >
            Buscar
          </button>
        </div>
      </div>

      {tagsFiltros.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          {tagsFiltros.map(({ label, chave }) => (
            <span
              key={chave}
              className="inline-flex items-center gap-1 bg-green-50 text-green-800 text-xs px-3 py-1 rounded-full"
            >
              {label}
              <button
                onClick={() => removerFiltro(chave)}
                className="ml-0.5 text-green-600 font-medium"
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}