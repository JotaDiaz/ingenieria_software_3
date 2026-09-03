from datetime import date
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class DetalleVentaBase(BaseModel):
    id_producto: int
    cantidad: int = Field(..., gt=0)


class DetalleVentaCreate(DetalleVentaBase):
    pass


class DetalleVentaResponse(BaseModel):
    id_detalle: int
    id_venta: int
    id_producto: int
    cantidad: int
    precio_unitario: float
    subtotal: float

    class Config:
        from_attributes = True


class VentaCreate(BaseModel):
    id_cliente: int
    fecha_venta: Optional[date] = None
    items: List[DetalleVentaCreate] = Field(..., min_length=1)


class VentaUpdate(BaseModel):
    items: List[DetalleVentaCreate] = Field(..., min_length=1)


class VentaResponse(BaseModel):
    id_venta: int
    id_cliente: int
    fecha_venta: date
    total: float
    estado: Literal["borrador", "procesada", "anulada"]
    detalles: List[DetalleVentaResponse] = []

    class Config:
        from_attributes = True
