from sqlalchemy import Column, Float, Integer, String, Text

from database.base import Base


class Producto(Base):
    __tablename__ = "productos"

    id_producto = Column(Integer, primary_key=True, index=True)
    codigo_sku = Column(String(20), unique=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    marca = Column(String(50), nullable=True)
    descripcion = Column(Text, nullable=True)
    precio_unitario = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    estado = Column(String(10), nullable=False, default="activo")
