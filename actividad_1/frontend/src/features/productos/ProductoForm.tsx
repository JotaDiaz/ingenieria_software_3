import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'

import { Alert, Button, Field, Input } from '../../components/ui'
import type { Producto, ProductoCreate } from '../../types'

interface Props {
  producto?: Producto
  onSubmit: (payload: ProductoCreate) => Promise<void>
  onCancel: () => void
}

type Errores = Partial<Record<'codigo_sku' | 'nombre' | 'precio_unitario' | 'stock', string>>

export function ProductoForm({ producto, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    codigo_sku: producto?.codigo_sku ?? '',
    nombre: producto?.nombre ?? '',
    marca: producto?.marca ?? '',
    descripcion: producto?.descripcion ?? '',
    precio_unitario: producto ? String(producto.precio_unitario) : '',
    stock: producto ? String(producto.stock) : '',
  })
  const [errores, setErrores] = useState<Errores>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const set = (campo: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }))
  }

  function validar(): boolean {
    const errs: Errores = {}
    if (!form.codigo_sku.trim()) errs.codigo_sku = 'El código/SKU es obligatorio'
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio'
    const precio = Number(form.precio_unitario)
    if (!form.precio_unitario || Number.isNaN(precio) || precio <= 0) {
      errs.precio_unitario = 'Debe ser un número positivo'
    }
    const stock = Number(form.stock)
    if (form.stock === '' || Number.isNaN(stock) || stock < 0) {
      errs.stock = 'Debe ser un número mayor o igual a 0'
    }
    setErrores(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validar()) return
    setEnviando(true)
    setServerError(null)
    try {
      await onSubmit({
        codigo_sku: form.codigo_sku.trim(),
        nombre: form.nombre.trim(),
        marca: form.marca.trim() || null,
        descripcion: form.descripcion.trim() || null,
        precio_unitario: Number(form.precio_unitario),
        stock: Number(form.stock),
      })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="card card--form" onSubmit={handleSubmit} noValidate>
      <h3 className="card-title">
        {producto ? `Editar producto #${producto.id_producto}` : 'Nuevo producto'}
      </h3>
      {serverError && <Alert>{serverError}</Alert>}
      <div className="form-grid">
        <Field label="Código / SKU" required error={errores.codigo_sku}>
          <Input value={form.codigo_sku} onChange={set('codigo_sku')} placeholder="SKU001" disabled={enviando} />
        </Field>
        <Field label="Nombre" required error={errores.nombre}>
          <Input value={form.nombre} onChange={set('nombre')} placeholder="Mouse inalámbrico" disabled={enviando} />
        </Field>
        <Field label="Marca">
          <Input value={form.marca} onChange={set('marca')} placeholder="Genius" disabled={enviando} />
        </Field>
        <Field label="Descripción">
          <Input value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción opcional" disabled={enviando} />
        </Field>
        <Field label="Precio unitario" required error={errores.precio_unitario}>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.precio_unitario}
            onChange={set('precio_unitario')}
            placeholder="1500"
            disabled={enviando}
          />
        </Field>
        <Field label="Stock inicial" required error={errores.stock}>
          <Input
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={set('stock')}
            placeholder="10"
            disabled={enviando}
          />
        </Field>
      </div>
      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : producto ? 'Guardar cambios' : 'Registrar'}
        </Button>
      </div>
    </form>
  )
}
