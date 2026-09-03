from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.base import get_db
from schemas.venta import VentaCreate, VentaResponse, VentaUpdate
from services import venta_service

router = APIRouter(prefix="/ventas", tags=["Ventas"])


@router.post("/", response_model=VentaResponse, status_code=201)
def create_venta(venta: VentaCreate, db: Session = Depends(get_db)):
    return venta_service.create_venta(db, venta)


@router.get("/", response_model=List[VentaResponse])
def listar_ventas(
    fecha_desde: Optional[date] = None,
    fecha_hasta: Optional[date] = None,
    dni: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return venta_service.list_ventas(db, fecha_desde, fecha_hasta, dni)


@router.get("/{venta_id}", response_model=VentaResponse)
def obtener_venta(venta_id: int, db: Session = Depends(get_db)):
    return venta_service.get_venta(db, venta_id)


@router.put("/{venta_id}", response_model=VentaResponse)
def actualizar_venta(venta_id: int, venta: VentaUpdate, db: Session = Depends(get_db)):
    return venta_service.update_venta(db, venta_id, venta)


@router.delete("/{venta_id}", response_model=VentaResponse)
def anular_venta(venta_id: int, db: Session = Depends(get_db)):
    return venta_service.anular_venta(db, venta_id)
