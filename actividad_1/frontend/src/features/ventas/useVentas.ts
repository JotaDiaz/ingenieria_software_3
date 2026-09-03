import { useCallback, useEffect, useState } from 'react'

import { api, errorMessage } from '../../lib/api'
import type { Venta, VentaCreate } from '../../types'

export interface VentaFiltros {
  fecha_desde: string
  fecha_hasta: string
  dni: string
}

const VACIOS: VentaFiltros = { fecha_desde: '', fecha_hasta: '', dni: '' }

export function useVentas() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listar = useCallback(async (filtros: VentaFiltros = VACIOS) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filtros.fecha_desde) params.set('fecha_desde', filtros.fecha_desde)
      if (filtros.fecha_hasta) params.set('fecha_hasta', filtros.fecha_hasta)
      if (filtros.dni) params.set('dni', filtros.dni)
      const qs = params.toString()
      const data = await api.get<Venta[]>(`/ventas/${qs ? `?${qs}` : ''}`)
      setVentas(data)
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const crear = useCallback(async (payload: VentaCreate) => {
    await api.post<Venta>('/ventas/', payload)
  }, [])

  const anular = useCallback(async (id: number) => {
    await api.delete<Venta>(`/ventas/${id}`)
  }, [])

  useEffect(() => {
    void listar()
  }, [listar])

  return { ventas, loading, error, listar, crear, anular }
}
