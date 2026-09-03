from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.base import get_db
from schemas.producto import ProductoCreate, ProductoResponse, ProductoUpdate
from services import producto_service

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post("/", response_model=ProductoResponse, status_code=201)
def create_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    return producto_service.create_producto(db, producto)


@router.get("/", response_model=List[ProductoResponse])
def listar_productos(
    nombre: Optional[str] = None,
    codigo_sku: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return producto_service.list_productos(db, nombre, codigo_sku)


@router.get("/{producto_id}", response_model=ProductoResponse)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    return producto_service.get_producto(db, producto_id)


@router.put("/{producto_id}", response_model=ProductoResponse)
def actualizar_producto(
    producto_id: int, producto: ProductoUpdate, db: Session = Depends(get_db)
):
    return producto_service.update_producto(db, producto_id, producto)


@router.delete("/{producto_id}", status_code=204)
def desactivar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto_service.deactivate_producto(db, producto_id)
