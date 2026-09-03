from typing import Literal, Optional

from pydantic import BaseModel, Field


class ProductoBase(BaseModel):
    codigo_sku: str = Field(..., min_length=1, max_length=20)
    nombre: str = Field(..., min_length=1, max_length=100)
    marca: Optional[str] = Field(None, max_length=50)
    descripcion: Optional[str] = None
    precio_unitario: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(BaseModel):
    codigo_sku: Optional[str] = Field(None, min_length=1, max_length=20)
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    marca: Optional[str] = Field(None, max_length=50)
    descripcion: Optional[str] = None
    precio_unitario: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)


class ProductoResponse(ProductoBase):
    id_producto: int
    estado: Literal["activo", "inactivo"]

    class Config:
        from_attributes = True
