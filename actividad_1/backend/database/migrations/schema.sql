DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS clientes;


CREATE TABLE clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    dni        VARCHAR(15)  NOT NULL UNIQUE,
    nombre     VARCHAR(50)  NOT NULL,
    apellido   VARCHAR(50)  NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    telefono   VARCHAR(20),
    estado     VARCHAR(10)  NOT NULL DEFAULT 'activo'
);

CREATE TABLE productos (
    id_producto     INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_sku      VARCHAR(20) NOT NULL UNIQUE,
    nombre          VARCHAR(100) NOT NULL,
    marca           VARCHAR(50),
    descripcion     TEXT,
    precio_unitario FLOAT       NOT NULL,
    stock           INTEGER     NOT NULL DEFAULT 0,
    estado          VARCHAR(10) NOT NULL DEFAULT 'activo'
);

CREATE TABLE ventas (
    id_venta    INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente  INTEGER     NOT NULL REFERENCES clientes(id_cliente),
    fecha_venta DATE        NOT NULL DEFAULT (date('now')),
    total       FLOAT       NOT NULL DEFAULT 0,
    estado      VARCHAR(10) NOT NULL DEFAULT 'borrador'
);

CREATE TABLE detalle_ventas (
    id_detalle      INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta        INTEGER NOT NULL REFERENCES ventas(id_venta),
    id_producto     INTEGER NOT NULL REFERENCES productos(id_producto),
    cantidad        INTEGER NOT NULL,
    precio_unitario FLOAT   NOT NULL,
    subtotal        FLOAT   NOT NULL
);

INSERT INTO clientes (id_cliente, dni, nombre, apellido, email, telefono, estado) VALUES
    (1, '30111222', 'Juan',    'Perez',  'juan.perez@mail.com',    '2804-421122',  'activo'),
    (2, '30555666', 'Ana',     'Gomez',  'ana.gomez@mail.com',     '2804-521133',  'activo'),
    (3, '28333444', 'Carlos',  'Lopez',  'carlos.lopez@mail.com',  '2804-431144',  'activo'),
    (4, '31888999', 'Lucia',   'Martinez','lucia.martinez@mail.com', '2804-541155', 'activo'),
    (5, '29444555', 'Pedro',   'Fernandez','pedro.fernandez@mail.com', '2804-651166', 'inactivo');

INSERT INTO productos (id_producto, codigo_sku, nombre, marca, descripcion, precio_unitario, stock, estado) VALUES
    (1, 'SKU001', 'Mouse inalámbrico',     'Genius',     'Mouse óptico 1600 dpi',        1500.00, 50, 'activo'),
    (2, 'SKU002', 'Teclado mecánico',      'Redragon',   'Teclado RGB switch blue',     8500.00, 30, 'activo'),
    (3, 'SKU003', 'Monitor 24" LED',       'LG',         'Monitor Full HD 75Hz',       105000.00, 15, 'activo'),
    (4, 'SKU004', 'Pendrive 32GB',         'Kingston',   'USB 3.0',                     4500.00, 80, 'activo'),
    (5, 'SKU005', 'Auriculares Bluetooth', 'JBL',        'Inalámbricos con micrófono', 32000.00, 0, 'inactivo'),
    (6, 'SKU006', 'Webcam HD 1080p',       'Logitech',   'Cámara para videollamadas',  18000.00, 12, 'activo');


INSERT INTO ventas (id_venta, id_cliente, fecha_venta, total, estado) VALUES
    (1, 1, '2026-08-20', 116500.00, 'procesada');

INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
    (1, 1, 2, 1500.00,  3000.00),
    (1, 2, 1, 8500.00,  8500.00),
    (1, 3, 1, 105000.00, 105000.00);

INSERT INTO ventas (id_venta, id_cliente, fecha_venta, total, estado) VALUES
    (2, 2, '2026-08-25', 9000.00, 'procesada');

INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
    (2, 4, 2, 4500.00, 9000.00);

INSERT INTO ventas (id_venta, id_cliente, fecha_venta, total, estado) VALUES
    (3, 4, '2026-08-27', 18000.00, 'anulada');

INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
    (3, 6, 1, 18000.00, 18000.00);

INSERT INTO ventas (id_venta, id_cliente, fecha_venta, total, estado) VALUES
    (4, 3, '2026-08-28', 22500.00, 'borrador');

INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
    (4, 4, 1, 4500.00,  4500.00),
    (4, 6, 1, 18000.00, 18000.00);


SELECT 'clientes'      AS tabla, COUNT(*) AS filas FROM clientes
UNION ALL
SELECT 'productos',            COUNT(*)            FROM productos
UNION ALL
SELECT 'ventas',               COUNT(*)            FROM ventas
UNION ALL
SELECT 'detalle_ventas',       COUNT(*)            FROM detalle_ventas;
