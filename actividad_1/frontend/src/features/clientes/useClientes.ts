import { useCallback, useEffect, useState } from 'react'

import { api, errorMessage } from '../../lib/api'
import type { Cliente, ClienteCreate } from '../../types'

export interface ClienteFiltros {
  nombre: string
  apellido: string
  dni: string
}

const VACIOS: ClienteFiltros = { nombre: '', apellido: '', dni: '' }

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listar = useCallback(async (filtros: ClienteFiltros = VACIOS) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filtros.nombre) params.set('nombre', filtros.nombre)
      if (filtros.apellido) params.set('apellido', filtros.apellido)
      if (filtros.dni) params.set('dni', filtros.dni)
      const qs = params.toString()
      const data = await api.get<Cliente[]>(`/clientes/${qs ? `?${qs}` : ''}`)
      setClientes(data)
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const crear = useCallback(async (payload: ClienteCreate) => {
    await api.post<Cliente>('/clientes/', payload)
  }, [])

  const actualizar = useCallback(async (id: number, payload: Partial<ClienteCreate>) => {
    await api.put<Cliente>(`/clientes/${id}`, payload)
  }, [])

  const darDeBaja = useCallback(async (id: number) => {
    await api.delete(`/clientes/${id}`)
  }, [])

  useEffect(() => {
    void listar()
  }, [listar])

  return { clientes, loading, error, listar, crear, actualizar, darDeBaja }
}
