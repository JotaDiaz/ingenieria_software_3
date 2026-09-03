from datetime import date

from sqlalchemy import text

from database.base import Base
from database.connection import SessionLocal, engine
from models import Cliente, DetalleVenta, Producto, Venta

CLIENTES = [
    (1, '30111222', 'Juan', 'Perez', 'juan.perez@mail.com', '2804-421122', 'activo'),
    (2, '30555666', 'Ana', 'Gomez', 'ana.gomez@mail.com', '2804-521133', 'activo'),
    (3, '28333444', 'Carlos', 'Lopez', 'carlos.lopez@mail.com', '2804-431144', 'activo'),
    (4, '31888999', 'Lucia', 'Martinez', 'lucia.martinez@mail.com', '2804-541155', 'activo'),
    (5, '29444555', 'Pedro', 'Fernandez', 'pedro.fernandez@mail.com', '2804-651166', 'inactivo'),
]

PRODUCTOS = [
    (1, 'SKU001', 'Mouse inalámbrico', 'Genius', 'Mouse óptico 1600 dpi', 1500.00, 50, 'activo'),
    (2, 'SKU002', 'Teclado mecánico', 'Redragon', 'Teclado RGB switch blue', 8500.00, 30, 'activo'),
    (3, 'SKU003', 'Monitor 24" LED', 'LG', 'Monitor Full HD 75Hz', 105000.00, 15, 'activo'),
    (4, 'SKU004', 'Pendrive 32GB', 'Kingston', 'USB 3.0', 4500.00, 80, 'activo'),
    (5, 'SKU005', 'Auriculares Bluetooth', 'JBL', 'Inalámbricos con micrófono', 32000.00, 0, 'inactivo'),
    (6, 'SKU006', 'Webcam HD 1080p', 'Logitech', 'Cámara para videollamadas', 18000.00, 12, 'activo'),
]

VENTAS = [
    (1, 1, date(2026, 8, 20), 116500.00, 'procesada', [
        (1, 2, 1500.00, 3000.00),
        (2, 1, 8500.00, 8500.00),
        (3, 1, 105000.00, 105000.00),
    ]),
    (2, 2, date(2026, 8, 25), 9000.00, 'procesada', [
        (4, 2, 4500.00, 9000.00),
    ]),
    (3, 4, date(2026, 8, 27), 18000.00, 'anulada', [
        (6, 1, 18000.00, 18000.00),
    ]),
    (4, 3, date(2026, 8, 28), 22500.00, 'borrador', [
        (4, 1, 4500.00, 4500.00),
        (6, 1, 18000.00, 18000.00),
    ]),
]


def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        for id_cliente, dni, nombre, apellido, email, telefono, estado in CLIENTES:
            db.add(Cliente(
                id_cliente=id_cliente, dni=dni, nombre=nombre,
                apellido=apellido, email=email, telefono=telefono, estado=estado,
            ))

        for id_producto, sku, nombre, marca, descripcion, precio, stock, estado in PRODUCTOS:
            db.add(Producto(
                id_producto=id_producto, codigo_sku=sku, nombre=nombre,
                marca=marca, descripcion=descripcion,
                precio_unitario=precio, stock=stock, estado=estado,
            ))

        for id_venta, id_cliente, fecha, total, estado, detalles in VENTAS:
            venta = Venta(
                id_venta=id_venta, id_cliente=id_cliente,
                fecha_venta=fecha, total=total, estado=estado,
            )
            for id_producto, cantidad, precio, subtotal in detalles:
                venta.detalles.append(DetalleVenta(
                    id_producto=id_producto, cantidad=cantidad,
                    precio_unitario=precio, subtotal=subtotal,
                ))
            db.add(venta)

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def verificar():
    db = SessionLocal()
    try:
        for tabla in ('clientes', 'productos', 'ventas', 'detalle_ventas'):
            filas = db.execute(text(f'SELECT COUNT(*) FROM {tabla}')).scalar()
            print(f'{tabla:<15} {filas} filas')
    finally:
        db.close()


if __name__ == '__main__':
    seed()
    verificar()
