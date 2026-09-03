from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.base import get_db
from schemas.cliente import ClienteCreate, ClienteResponse, ClienteUpdate
from services import cliente_service

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.post("/", response_model=ClienteResponse, status_code=201)
def create_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    return cliente_service.create_cliente(db, cliente)


@router.get("/", response_model=List[ClienteResponse])
def listar_clientes(
    nombre: Optional[str] = None,
    apellido: Optional[str] = None,
    dni: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return cliente_service.list_clientes(db, nombre, apellido, dni)


@router.get("/{cliente_id}", response_model=ClienteResponse)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    return cliente_service.get_cliente(db, cliente_id)


@router.put("/{cliente_id}", response_model=ClienteResponse)
def actualizar_cliente(cliente_id: int, cliente: ClienteUpdate, db: Session = Depends(get_db)):
    return cliente_service.update_cliente(db, cliente_id, cliente)


@router.delete("/{cliente_id}", status_code=204)
def desactivar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente_service.deactivate_cliente(db, cliente_id)
