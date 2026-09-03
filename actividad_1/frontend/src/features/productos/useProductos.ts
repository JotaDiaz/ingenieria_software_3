import { useCallback, useEffect, useState } from 'react'

import { api, errorMessage } from '../../lib/api'
import type { Producto, ProductoCreate } from '../../types'

export interface ProductoFiltros {
  nombre: string
  codigo_sku: string
}

const VACIOS: ProductoFiltros = { nombre: '', codigo_sku: '' }

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listar = useCallback(async (filtros: ProductoFiltros = VACIOS) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filtros.nombre) params.set('nombre', filtros.nombre)
      if (filtros.codigo_sku) params.set('codigo_sku', filtros.codigo_sku)
      const qs = params.toString()
      const data = await api.get<Producto[]>(`/productos/${qs ? `?${qs}` : ''}`)
      setProductos(data)
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const crear = useCallback(async (payload: ProductoCreate) => {
    await api.post<Producto>('/productos/', payload)
  }, [])

  const actualizar = useCallback(async (id: number, payload: Partial<ProductoCreate>) => {
    await api.put<Producto>(`/productos/${id}`, payload)
  }, [])

  const darDeBaja = useCallback(async (id: number) => {
    await api.delete(`/productos/${id}`)
  }, [])

  useEffect(() => {
    void listar()
  }, [listar])

  return { productos, loading, error, listar, crear, actualizar, darDeBaja }
}
