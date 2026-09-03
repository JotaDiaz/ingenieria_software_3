from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field

SOLO_LETRAS = r"^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ ]+$"
SOLO_NUMEROS_GUIONES = r"^[0-9-]+$"


class ClienteBase(BaseModel):
    dni: str = Field(..., min_length=6, max_length=15, description="DNI del cliente")
    nombre: str = Field(..., pattern=SOLO_LETRAS, max_length=50)
    apellido: str = Field(..., pattern=SOLO_LETRAS, max_length=50)
    email: EmailStr
    telefono: Optional[str] = Field(None, pattern=SOLO_NUMEROS_GUIONES, max_length=20)


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    dni: Optional[str] = Field(None, min_length=6, max_length=15)
    nombre: Optional[str] = Field(None, pattern=SOLO_LETRAS, max_length=50)
    apellido: Optional[str] = Field(None, pattern=SOLO_LETRAS, max_length=50)
    email: Optional[EmailStr] = None
    telefono: Optional[str] = Field(None, pattern=SOLO_NUMEROS_GUIONES, max_length=20)


class ClienteResponse(ClienteBase):
    id_cliente: int
    estado: Literal["activo", "inactivo"]

    class Config:
        from_attributes = True
