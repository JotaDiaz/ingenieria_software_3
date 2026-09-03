from sqlalchemy import Column, Integer, String

from database.base import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente = Column(Integer, primary_key=True, index=True)
    dni = Column(String(15), unique=True, nullable=False)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(20), nullable=True)
    estado = Column(String(10), nullable=False, default="activo")
