export type EstadoVenta = 'borrador' | 'procesada' | 'anulada'

export interface DetalleVenta {
  id_detalle: number
  id_venta: number
  id_producto: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface Venta {
  id_venta: number
  id_cliente: number
  fecha_venta: string
  total: number
  estado: EstadoVenta
  detalles: DetalleVenta[]
}

export interface VentaItemCreate {
  id_producto: number
  cantidad: number
}

export interface VentaCreate {
  id_cliente: number
  fecha_venta?: string | null
  items: VentaItemCreate[]
}

export interface VentaUpdate {
  items: VentaItemCreate[]
}
