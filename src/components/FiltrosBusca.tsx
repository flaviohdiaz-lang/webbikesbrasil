'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIAS, ESTADOS } from '@/lib/categorias'
import { FiltrosBusca as TFiltros } from '@/hooks/useAnuncios'

interface Props {
  onChange: (filtros: TFiltros) => void
}

export default function FiltrosBusca({ onChange }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const [busca, setBusca] = useState(params.get('busca') ?? '')
  const [categoria, setCategoria] = useState(params.get('categoria') ?? '')
  const [subcategoria, setSubcategoria] = useState(params.get('subcategoria') ?? '')
  const [estado, setEstado] = useState(params.get('estado') ?? '')
  const [cidade, setCidade] = useState(params.get('cidade') ?? '')
  const [precoMin, setPrecoMin] = useState(params.get('precoMin') ?? '')
  const [precoMax, setPrecoMax] = useState(params.get('precoMax') ?? '')
  const [ordenar, setOrdenar] = useState<TFiltros['ordenar']>(
    (params.get('ordenar') as TFiltros['ordenar']) ?? 'recentes'
  )

  const subcategorias = categoria ? CATEGORIAS[categoria] ?? [] : []

  function aplicar() {
    const filtros: TFiltros = {
      busca: busca || undefined,
      categoria: categoria || undefined,
      subcategoria: subcategoria || undefined,
      estado: estado || undefined,
      cidade: cidade || undefined,
      precoMin: precoMin ? Number(precoMin) : undefined,
      precoMax: precoMax ? Number(precoMax) : undefined,
      ordenar,
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
    router.push('/anuncios', { scroll: false })
    onChange({})
  }

  function removerFiltro(chave: keyof TFiltros) {
    if (chave === 'busca') setBusca('')
    if (chave === 'categoria') { setCategoria(''); setSubcategoria('') }
    if (chave === 'subcategoria') setSubcategoria('')
    if (chave === 'estado') setEstado('')
    if (chave === 'cidade') setCidade('')
    if (chave === 'precoMin') setPrecoMin('')
    if (chave === 'precoMax') setPrecoMax('')
    setTimeout(aplicar, 0)
  }

  const tagsFiltros = [
    busca ? { label: '"' + busca + '"', chave: 'busca' as const } : null,
    categoria ? { label: categoria, chave: 'categoria' as const } : null,
    subcategoria ? { label: subcategoria, chave: 'subcategoria' as const } : null,
    estado ? { label: estado, chave: 'estado' as const } : null,
    cidade ? { label: cidade, chave: 'cidade' as const } : null,
    precoMin ? { label: 'A partir de R$ ' + Number(precoMin).toLocaleString('pt-BR'), chave: 'precoMin' as const } : null,
    precoMax ? { label: 'Ate R$ ' + Number(precoMax).toLocaleString('pt-BR'), chave: 'precoMax' as const } : null,
  ].filter(Boolean) as { label: string; chave: keyof TFiltros }[]

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
            placeholder="Speed, mountain, quadro..."
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
            {Object.keys(CATEGORIAS).map(c => (
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
        <div className="flex flex-col gap-1 min-w-[110px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Preco min.</label>
          <input
            type="number"
            value={precoMin}
            onChange={e => setPrecoMin(e.target.value)}
            placeholder="R$ 0"
            min={0}
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-green-600"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[110px]">
          <label className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Preco max.</label>
          <input
            type="number"
            value={precoMax}
            onChange={e => setPrecoMax(e.target.value)}
            placeholder="R$ 50.000"
            min={0}
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-green-600"
          />
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