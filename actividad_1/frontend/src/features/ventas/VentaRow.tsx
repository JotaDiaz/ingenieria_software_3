import { Badge, Button } from '../../components/ui'
import { formatMoneda } from '../../lib/format'
import type { Venta } from '../../types'

function estadoTone(estado: Venta['estado']) {
  if (estado === 'procesada') return 'success'
  if (estado === 'anulada') return 'danger'
  return 'warning'
}

interface Props {
  venta: Venta
  expandido: boolean
  onToggleDetalle: () => void
  onAnular: () => void
}

export function VentaRow({ venta, expandido, onToggleDetalle, onAnular }: Props) {
  return (
    <>
      <tr>
        <td>{venta.id_venta}</td>
        <td>#{venta.id_cliente}</td>
        <td>{venta.fecha_venta}</td>
        <td className="num">{formatMoneda(venta.total)}</td>
        <td>
          <Badge tone={estadoTone(venta.estado)}>{venta.estado}</Badge>
        </td>
        <td>
          <div className="row-actions">
            <Button size="sm" variant="secondary" onClick={onToggleDetalle}>
              {expandido ? 'Ocultar' : 'Detalle'}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={onAnular}
              disabled={venta.estado !== 'procesada'}
            >
              Anular
            </Button>
          </div>
        </td>
      </tr>
      {expandido && (
        <tr className="detail-row">
          <td colSpan={6}>
            <div className="detail-inner">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.detalles.map((det) => (
                    <tr key={det.id_detalle}>
                      <td>#{det.id_producto}</td>
                      <td>{det.cantidad}</td>
                      <td className="num">{formatMoneda(det.precio_unitario)}</td>
                      <td className="num">{formatMoneda(det.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-line">Total: {formatMoneda(venta.total)}</div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
