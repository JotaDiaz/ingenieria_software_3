import { useState } from 'react'

import {
  Badge,
  Button,
  EmptyState,
  Field,
  FilterBar,
  Input,
  PageHeader,
  Spinner,
} from '../../components/ui'
import { formatMoneda } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import type { Producto, ProductoCreate } from '../../types'
import { ProductoForm } from './ProductoForm'
import { useProductos } from './useProductos'

export function ProductosPage() {
  const { productos, loading, error, listar, crear, actualizar, darDeBaja } = useProductos()
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [filtros, setFiltros] = useState({ nombre: '', codigo_sku: '' })
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  function abrirNuevo() {
    setEditando(null)
    setFormularioAbierto(true)
    setErrorAccion(null)
  }

  function abrirEditar(producto: Producto) {
    setEditando(producto)
    setFormularioAbierto(true)
    setErrorAccion(null)
  }

  function cerrarFormulario() {
    setFormularioAbierto(false)
    setEditando(null)
  }

  async function guardar(payload: ProductoCreate) {
    if (editando) {
      await actualizar(editando.id_producto, payload)
      setMensaje('Producto modificado correctamente')
    } else {
      await crear(payload)
      setMensaje('Producto registrado correctamente')
    }
    cerrarFormulario()
    await listar(filtros)
  }

  async function baja(producto: Producto) {
    setErrorAccion(null)
    setMensaje(null)
    try {
      await darDeBaja(producto.id_producto)
      setMensaje(`Producto ${producto.nombre} dado de baja`)
      await listar(filtros)
    } catch (e) {
      setErrorAccion(errorMessage(e))
    }
  }

  return (
    <section>
      <PageHeader
        title="Productos"
        subtitle="Catálogo, inventario, altas y bajas"
        action={
          <Button onClick={abrirNuevo} disabled={formularioAbierto}>
            Nuevo producto
          </Button>
        }
      />

      {error && <div className="alert alert--danger">{error}</div>}
      {mensaje && <div className="alert alert--success">{mensaje}</div>}
      {errorAccion && <div className="alert alert--danger">{errorAccion}</div>}

      {formularioAbierto && (
        <ProductoForm producto={editando ?? undefined} onSubmit={guardar} onCancel={cerrarFormulario} />
      )}

      <div className="card">
        <FilterBar
          onApply={() => void listar(filtros)}
          onReset={() => {
            setFiltros({ nombre: '', codigo_sku: '' })
            void listar()
          }}
          resetDisabled={!filtros.nombre && !filtros.codigo_sku}
        >
          <Field label="Nombre">
            <Input
              placeholder="Nombre del producto"
              value={filtros.nombre}
              onChange={(e) => setFiltros((f) => ({ ...f, nombre: e.target.value }))}
            />
          </Field>
          <Field label="Código / SKU">
            <Input
              placeholder="P.ej. SKU-123"
              value={filtros.codigo_sku}
              onChange={(e) => setFiltros((f) => ({ ...f, codigo_sku: e.target.value }))}
            />
          </Field>
        </FilterBar>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="loading-row">
            <Spinner />
          </div>
        ) : productos.length === 0 ? (
          <EmptyState message="No se encontraron resultados" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código / SKU</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th className="row-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id_producto}>
                  <td>{producto.id_producto}</td>
                  <td>{producto.codigo_sku}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.marca ?? '—'}</td>
                  <td className="num">{formatMoneda(producto.precio_unitario)}</td>
                  <td className="num">{producto.stock}</td>
                  <td>
                    <Badge tone={producto.estado === 'activo' ? 'success' : 'danger'}>
                      {producto.estado}
                    </Badge>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Button size="sm" variant="secondary" onClick={() => abrirEditar(producto)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => void baja(producto)}>
                        Dar de baja
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
