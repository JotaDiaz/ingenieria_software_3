from datetime import date
from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.cliente import Cliente
from models.producto import Producto
from models.venta import DetalleVenta, Venta
from schemas.venta import DetalleVentaCreate, VentaCreate, VentaUpdate


def get_venta(db: Session, venta_id: int) -> Venta:
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return venta


def list_ventas(
    db: Session,
    fecha_desde: Optional[date] = None,
    fecha_hasta: Optional[date] = None,
    dni: Optional[str] = None,
) -> List[Venta]:
    query = db.query(Venta)
    if fecha_desde:
        query = query.filter(Venta.fecha_venta >= fecha_desde)
    if fecha_hasta:
        query = query.filter(Venta.fecha_venta <= fecha_hasta)
    if dni:
        ids = [c.id_cliente for c in db.query(Cliente).filter(Cliente.dni == dni).all()]
        if not ids:
            return []
        query = query.filter(Venta.id_cliente.in_(ids))
    return query.order_by(Venta.fecha_venta.desc(), Venta.id_venta.desc()).all()


def _validar_producto(db: Session, item: DetalleVentaCreate) -> Producto:
    producto = db.query(Producto).filter(Producto.id_producto == item.id_producto).first()
    if not producto or producto.estado == "inactivo":
        raise HTTPException(
            status_code=400, detail=f"El producto {item.id_producto} no está disponible"
        )
    if item.cantidad > producto.stock:
        raise HTTPException(
            status_code=400,
            detail=f"No hay stock suficiente para el producto {producto.nombre}",
        )
    return producto


def create_venta(db: Session, data: VentaCreate) -> Venta:
    cliente = db.query(Cliente).filter(Cliente.id_cliente == data.id_cliente).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    if cliente.estado == "inactivo":
        raise HTTPException(
            status_code=400, detail="No se pueden emitir ventas a clientes dados de baja"
        )

    venta = Venta(
        id_cliente=data.id_cliente,
        fecha_venta=data.fecha_venta or date.today(),
        total=0,
        estado="procesada",
    )
    db.add(venta)
    db.flush()

    total = 0.0
    for item in data.items:
        producto = _validar_producto(db, item)
        subtotal = round(item.cantidad * producto.precio_unitario, 2)
        db.add(
            DetalleVenta(
                id_venta=venta.id_venta,
                id_producto=producto.id_producto,
                cantidad=item.cantidad,
                precio_unitario=producto.precio_unitario,
                subtotal=subtotal,
            )
        )
        total += subtotal
        producto.stock -= item.cantidad

    venta.total = round(total, 2)
    db.commit()
    db.refresh(venta)
    return venta


def update_venta(db: Session, venta_id: int, data: VentaUpdate) -> Venta:
    venta = get_venta(db, venta_id)
    if venta.estado != "borrador":
        raise HTTPException(
            status_code=400, detail="Solo se pueden modificar ventas en estado borrador"
        )

    for item in data.items:
        _validar_producto(db, item)

    for detalle in venta.detalles:
        db.delete(detalle)
    db.flush()

    total = 0.0
    for item in data.items:
        producto = db.query(Producto).filter(Producto.id_producto == item.id_producto).first()
        subtotal = round(item.cantidad * producto.precio_unitario, 2)
        db.add(
            DetalleVenta(
                id_venta=venta.id_venta,
                id_producto=producto.id_producto,
                cantidad=item.cantidad,
                precio_unitario=producto.precio_unitario,
                subtotal=subtotal,
            )
        )
        total += subtotal

    venta.total = round(total, 2)
    db.commit()
    db.refresh(venta)
    return venta


def anular_venta(db: Session, venta_id: int) -> Venta:
    venta = get_venta(db, venta_id)
    if venta.estado != "procesada":
        raise HTTPException(status_code=400, detail="Solo se pueden anular ventas procesadas")

    for detalle in venta.detalles:
        producto = (
            db.query(Producto).filter(Producto.id_producto == detalle.id_producto).first()
        )
        if producto:
            producto.stock += detalle.cantidad

    venta.estado = "anulada"
    db.commit()
    db.refresh(venta)
    return venta
