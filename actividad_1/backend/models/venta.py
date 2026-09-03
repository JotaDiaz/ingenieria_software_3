from datetime import date

from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database.base import Base


class Venta(Base):
    __tablename__ = "ventas"

    id_venta = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=False)
    fecha_venta = Column(Date, nullable=False, default=date.today)
    total = Column(Float, nullable=False, default=0)
    estado = Column(String(10), nullable=False, default="borrador")

    cliente = relationship("Cliente")
    detalles = relationship(
        "DetalleVenta", back_populates="venta", cascade="all, delete-orphan"
    )


class DetalleVenta(Base):
    __tablename__ = "detalle_ventas"

    id_detalle = Column(Integer, primary_key=True, index=True)
    id_venta = Column(Integer, ForeignKey("ventas.id_venta"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id_producto"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    venta = relationship("Venta", back_populates="detalles")
    producto = relationship("Producto")
