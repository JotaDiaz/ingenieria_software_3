from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.cliente import Cliente
from schemas.cliente import ClienteCreate, ClienteUpdate


def get_cliente(db: Session, cliente_id: int) -> Cliente:
    cliente = db.query(Cliente).filter(Cliente.id_cliente == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


def list_clientes(
    db: Session,
    nombre: Optional[str] = None,
    apellido: Optional[str] = None,
    dni: Optional[str] = None,
) -> List[Cliente]:
    query = db.query(Cliente)
    if nombre:
        query = query.filter(Cliente.nombre.ilike(f"%{nombre}%"))
    if apellido:
        query = query.filter(Cliente.apellido.ilike(f"%{apellido}%"))
    if dni:
        query = query.filter(Cliente.dni.ilike(f"%{dni}%"))
    return query.all()


def create_cliente(db: Session, data: ClienteCreate) -> Cliente:
    if db.query(Cliente).filter(Cliente.dni == data.dni).first():
        raise HTTPException(status_code=409, detail="El cliente ya se encuentra registrado")
    if db.query(Cliente).filter(Cliente.email == data.email).first():
        raise HTTPException(status_code=409, detail="El email ya está en uso")
    cliente = Cliente(**data.model_dump())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente


def update_cliente(db: Session, cliente_id: int, data: ClienteUpdate) -> Cliente:
    cliente = get_cliente(db, cliente_id)
    cambios = data.model_dump(exclude_unset=True)
    if "dni" in cambios and cambios["dni"]:
        if db.query(Cliente).filter(
            Cliente.dni == cambios["dni"], Cliente.id_cliente != cliente_id
        ).first():
            raise HTTPException(status_code=409, detail="El DNI ya está en uso")
    if "email" in cambios and cambios["email"]:
        if db.query(Cliente).filter(
            Cliente.email == cambios["email"], Cliente.id_cliente != cliente_id
        ).first():
            raise HTTPException(status_code=409, detail="El email ya está en uso")
    for campo, valor in cambios.items():
        setattr(cliente, campo, valor)
    db.commit()
    db.refresh(cliente)
    return cliente


def deactivate_cliente(db: Session, cliente_id: int) -> None:
    cliente = get_cliente(db, cliente_id)
    if cliente.estado == "inactivo":
        raise HTTPException(status_code=400, detail="El cliente ya se encuentra dado de baja")
    cliente.estado = "inactivo"
    db.commit()
