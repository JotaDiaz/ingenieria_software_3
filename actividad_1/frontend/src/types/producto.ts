export type EstadoProducto = 'activo' | 'inactivo'

export interface Producto {
  id_producto: number
  codigo_sku: string
  nombre: string
  marca: string | null
  descripcion: string | null
  precio_unitario: number
  stock: number
  estado: EstadoProducto
}

export interface ProductoCreate {
  codigo_sku: string
  nombre: string
  marca?: string | null
  descripcion?: string | null
  precio_unitario: number
  stock: number
}

export type ProductoUpdate = Partial<ProductoCreate>
