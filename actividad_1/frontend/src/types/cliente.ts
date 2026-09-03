export type EstadoCliente = 'activo' | 'inactivo'

export interface Cliente {
  id_cliente: number
  dni: string
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  estado: EstadoCliente
}

export interface ClienteCreate {
  dni: string
  nombre: string
  apellido: string
  email: string
  telefono?: string | null
}

export type ClienteUpdate = Partial<ClienteCreate>
