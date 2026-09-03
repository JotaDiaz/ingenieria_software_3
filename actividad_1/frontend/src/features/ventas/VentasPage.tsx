import { useState } from 'react'

import {
  Button,
  EmptyState,
  Field,
  FilterBar,
  Input,
  PageHeader,
  Spinner,
} from '../../components/ui'
import { errorMessage } from '../../lib/api'
import type { Venta, VentaCreate } from '../../types'
import { VentaForm } from './VentaForm'
import { VentaRow } from './VentaRow'
import { useVentas } from './useVentas'

export function VentasPage() {
  const { ventas, loading, error, listar, crear, anular } = useVentas()
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [filtros, setFiltros] = useState({ fecha_desde: '', fecha_hasta: '', dni: '' })
  const [detalleId, setDetalleId] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  async function guardar(payload: VentaCreate) {
    await crear(payload)
    setFormularioAbierto(false)
    setMensaje('Venta registrada y stock descontado')
    await listar(filtros)
  }

  async function cancelarVenta(venta: Venta) {
    setErrorAccion(null)
    setMensaje(null)
    try {
      await anular(venta.id_venta)
      setMensaje(`Venta #${venta.id_venta} anulada y stock restaurado`)
      await listar(filtros)
    } catch (e) {
      setErrorAccion(errorMessage(e))
    }
  }

  return (
    <section>
      <PageHeader
        title="Ventas"
        subtitle="Registrar, anular y consultar por fechas o cliente"
        action={
          <Button onClick={() => setFormularioAbierto(true)} disabled={formularioAbierto}>
            Nueva venta
          </Button>
        }
      />

      {error && <div className="alert alert--danger">{error}</div>}
      {mensaje && <div className="alert alert--success">{mensaje}</div>}
      {errorAccion && <div className="alert alert--danger">{errorAccion}</div>}

      {formularioAbierto && (
        <VentaForm
          onCancel={() => setFormularioAbierto(false)}
          onSubmit={guardar}
        />
      )}

      <div className="card">
        <FilterBar
          onApply={() => void listar(filtros)}
          onReset={() => {
            setFiltros({ fecha_desde: '', fecha_hasta: '', dni: '' })
            void listar()
          }}
          resetDisabled={!filtros.fecha_desde && !filtros.fecha_hasta && !filtros.dni}
        >
          <Field label="Desde">
            <Input
              type="date"
              value={filtros.fecha_desde}
              onChange={(e) => setFiltros((f) => ({ ...f, fecha_desde: e.target.value }))}
            />
          </Field>
          <Field label="Hasta">
            <Input
              type="date"
              value={filtros.fecha_hasta}
              onChange={(e) => setFiltros((f) => ({ ...f, fecha_hasta: e.target.value }))}
            />
          </Field>
          <Field label="DNI del cliente">
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
        ) : ventas.length === 0 ? (
          <EmptyState message="No se encontraron ventas" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="row-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <VentaRow
                  key={venta.id_venta}
                  venta={venta}
                  expandido={detalleId === venta.id_venta}
                  onToggleDetalle={() =>
                    setDetalleId(detalleId === venta.id_venta ? null : venta.id_venta)
                  }
                  onAnular={() => void cancelarVenta(venta)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
