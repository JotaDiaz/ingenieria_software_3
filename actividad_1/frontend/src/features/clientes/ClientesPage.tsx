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
import { errorMessage } from '../../lib/api'
import type { Cliente, ClienteCreate } from '../../types'
import { ClienteForm } from './ClienteForm'
import { useClientes } from './useClientes'

export function ClientesPage() {
  const { clientes, loading, error, listar, crear, actualizar, darDeBaja } = useClientes()
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [filtros, setFiltros] = useState({ nombre: '', apellido: '', dni: '' })
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  function abrirNuevo() {
    setEditando(null)
    setFormularioAbierto(true)
    setErrorAccion(null)
  }

  function abrirEditar(cliente: Cliente) {
    setEditando(cliente)
    setFormularioAbierto(true)
    setErrorAccion(null)
  }

  function cerrarFormulario() {
    setFormularioAbierto(false)
    setEditando(null)
  }

  async function guardar(payload: ClienteCreate) {
    if (editando) {
      await actualizar(editando.id_cliente, payload)
      setMensaje('Cliente modificado correctamente')
    } else {
      await crear(payload)
      setMensaje('Cliente registrado correctamente')
    }
    cerrarFormulario()
    await listar(filtros)
  }

  async function baja(cliente: Cliente) {
    setErrorAccion(null)
    setMensaje(null)
    try {
      await darDeBaja(cliente.id_cliente)
      setMensaje(`Cliente ${cliente.nombre} ${cliente.apellido} dado de baja`)
      await listar(filtros)
    } catch (e) {
      setErrorAccion(errorMessage(e))
    }
  }

  return (
    <section>
      <PageHeader
        title="Clientes"
        subtitle="Alta, baja, modificación y listado con filtros"
        action={
          <Button onClick={abrirNuevo} disabled={formularioAbierto}>
            Nuevo cliente
          </Button>
        }
      />

      {error && <div className="alert alert--danger">{error}</div>}
      {mensaje && <div className="alert alert--success">{mensaje}</div>}
      {errorAccion && <div className="alert alert--danger">{errorAccion}</div>}

      {formularioAbierto && (
        <ClienteForm
          cliente={editando ?? undefined}
          onSubmit={guardar}
          onCancel={cerrarFormulario}
        />
      )}

      <div className="card">
        <FilterBar
          onApply={() => void listar(filtros)}
          onReset={() => {
            setFiltros({ nombre: '', apellido: '', dni: '' })
            void listar()
          }}
          resetDisabled={!filtros.nombre && !filtros.apellido && !filtros.dni}
        >
          <Field label="Nombre">
            <Input
              placeholder="Martin"
              value={filtros.nombre}
              onChange={(e) => setFiltros((f) => ({ ...f, nombre: e.target.value }))}
            />
          </Field>
          <Field label="Apellido">
            <Input
              placeholder="García"
              value={filtros.apellido}
              onChange={(e) => setFiltros((f) => ({ ...f, apellido: e.target.value }))}
            />
          </Field>
          <Field label="DNI">
            <Input
              placeholder="Buscar por DNI"
              value={filtros.dni}
              onChange={(e) => setFiltros((f) => ({ ...f, dni: e.target.value }))}
            />
          </Field>
        </FilterBar>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="loading-row">
            <Spinner />
          </div>
        ) : clientes.length === 0 ? (
          <EmptyState message="No se encontraron resultados" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th className="row-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.dni}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono ?? '—'}</td>
                  <td>
                    <Badge tone={cliente.estado === 'activo' ? 'success' : 'danger'}>
                      {cliente.estado}
                    </Badge>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Button size="sm" variant="secondary" onClick={() => abrirEditar(cliente)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => void baja(cliente)}>
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
