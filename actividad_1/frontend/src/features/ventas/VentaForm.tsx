import type { FormEvent } from 'react'
import { useState } from 'react'

import { Alert, Button, Field, Input, Select } from '../../components/ui'
import type { VentaCreate, VentaItemCreate } from '../../types'
import { useClientes } from '../clientes/useClientes'
import { useProductos } from '../productos/useProductos'

interface Props {
  onCancel: () => void
  onSubmit: (payload: VentaCreate) => Promise<void>
}

export function VentaForm({ onCancel, onSubmit }: Props) {
  const { clientes } = useClientes()
  const { productos } = useProductos()

  const clientesActivos = clientes.filter((c) => c.estado === 'activo')
  const productosActivos = productos.filter((p) => p.estado === 'activo')

  const [idCliente, setIdCliente] = useState('')
  const [fecha, setFecha] = useState('')
  const [items, setItems] = useState<VentaItemCreate[]>([{ id_producto: 0, cantidad: 1 }])
  const [errores, setErrores] = useState<{ cliente?: string; items?: string }>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  function actualizarItem(index: number, campo: keyof VentaItemCreate, valor: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [campo]: Number(valor) } : item)),
    )
  }

  function validar(): boolean {
    const errs: { cliente?: string; items?: string } = {}
    if (!idCliente) errs.cliente = 'Seleccioná un cliente'
    const invalido = items.some((i) => !i.id_producto || i.cantidad < 1)
    if (items.length === 0 || invalido) errs.items = 'Cada ítem debe tener producto y cantidad mayor a 0'
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
        id_cliente: Number(idCliente),
        fecha_venta: fecha || null,
        items,
      })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="card card--form" onSubmit={handleSubmit} noValidate>
      <h3 className="card-title">Nueva venta</h3>
      {serverError && <Alert>{serverError}</Alert>}
      <div className="form-grid">
        <Field label="Cliente" required error={errores.cliente}>
          <Select value={idCliente} onChange={(e) => setIdCliente(e.target.value)} disabled={enviando}>
            <option value="">Seleccioná un cliente…</option>
            {clientesActivos.map((c) => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.dni} · {c.nombre} {c.apellido}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Fecha de venta" hint="Vacío = hoy">
          <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={enviando} />
        </Field>
      </div>

      <div className="items-list">
        {items.map((item, index) => (
          <div className="item-row" key={index}>
            <Field label={`Producto ${index + 1}`} required>
              <Select
                value={item.id_producto}
                onChange={(e) => actualizarItem(index, 'id_producto', e.target.value)}
                disabled={enviando}
              >
                <option value="0">Seleccioná un producto…</option>
                {productosActivos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.codigo_sku} · {p.nombre} (stock {p.stock})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Cantidad" required>
              <Input
                type="number"
                min="1"
                step="1"
                value={item.cantidad}
                onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
                disabled={enviando}
              />
            </Field>
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={enviando || items.length === 1}
              onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      {errores.items && <div className="field-error">{errores.items}</div>}

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          disabled={enviando}
          onClick={() => setItems((prev) => [...prev, { id_producto: 0, cantidad: 1 }])}
        >
          + Agregar producto
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Procesando…' : 'Registrar venta'}
        </Button>
      </div>
    </form>
  )
}
