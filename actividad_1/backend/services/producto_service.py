from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.producto import Producto
from schemas.producto import ProductoCreate, ProductoUpdate


def get_producto(db: Session, producto_id: int) -> Producto:
    producto = db.query(Producto).filter(Producto.id_producto == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


def list_productos(
    db: Session,
    nombre: Optional[str] = None,
    codigo_sku: Optional[str] = None,
) -> List[Producto]:
    query = db.query(Producto)
    if nombre:
        query = query.filter(Producto.nombre.ilike(f"%{nombre}%"))
    if codigo_sku:
        query = query.filter(Producto.codigo_sku.ilike(f"%{codigo_sku}%"))
    return query.all()


def create_producto(db: Session, data: ProductoCreate) -> Producto:
    if db.query(Producto).filter(Producto.codigo_sku == data.codigo_sku).first():
        raise HTTPException(status_code=409, detail="El código de producto está duplicado")
    producto = Producto(**data.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto


def update_producto(db: Session, producto_id: int, data: ProductoUpdate) -> Producto:
    producto = get_producto(db, producto_id)
    cambios = data.model_dump(exclude_unset=True)
    if "codigo_sku" in cambios and cambios["codigo_sku"]:
        if db.query(Producto).filter(
            Producto.codigo_sku == cambios["codigo_sku"],
            Producto.id_producto != producto_id,
        ).first():
            raise HTTPException(status_code=409, detail="El código de producto está duplicado")
    for campo, valor in cambios.items():
        setattr(producto, campo, valor)
    db.commit()
    db.refresh(producto)
    return producto


def deactivate_producto(db: Session, producto_id: int) -> None:
    producto = get_producto(db, producto_id)
    if producto.estado == "inactivo":
        raise HTTPException(status_code=400, detail="El producto ya se encuentra dado de baja")
    producto.estado = "inactivo"
    db.commit()
