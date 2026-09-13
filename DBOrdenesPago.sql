
CREATE DATABASE DBOrdenesPago;
GO

USE DBOrdenesPago;
GO


-- TABLA: Cliente
CREATE TABLE Cliente
(
    IdCliente INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL,
    Documento VARCHAR(20) NOT NULL,
    Email VARCHAR(200) NULL,
    Estado INT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO


-- TABLA: Producto
CREATE TABLE Producto
(
    IdProducto INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL,
    Precio DECIMAL(12,4) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    Estado INT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- TABLA: Ordenes

CREATE TABLE Orden
(
    IdOrden INT IDENTITY(1,1) PRIMARY KEY,
    IdCliente INT NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Total DECIMAL(10,2) NOT NULL DEFAULT 0,
    Estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NOT NULL DEFAULT GETDATE()

    CONSTRAINT FK_Ordenes_Cliente
        FOREIGN KEY (IdCliente)
        REFERENCES Cliente(IdCliente),

    CONSTRAINT CK_Ordenes_Estado
        CHECK (Estado IN ('Pendiente', 'Pagada', 'Anulada'))
);
GO


-- TABLA: DetalleOrden

CREATE TABLE DetalleOrden
(
    IdDetalle INT IDENTITY(1,1) PRIMARY KEY,
    IdOrden INT NOT NULL,
    IdProducto INT NOT NULL,
    NombreProducto VARCHAR(200) NOT NULL,
    Cantidad INT NOT NULL,
    Precio DECIMAL(12,4) NOT NULL,
    Subtotal DECIMAL(12,4) NOT NULL,

    CONSTRAINT FK_DetalleOrden_Ordenes
        FOREIGN KEY (IdOrden)
        REFERENCES Orden(IdOrden),

    CONSTRAINT FK_DetalleOrden_Producto
        FOREIGN KEY (IdProducto)
        REFERENCES Producto(IdProducto)
);
GO


-- DATOS DE PRUEBA: CLIENTE

INSERT INTO Cliente (Nombre, Documento, Email)
VALUES
('Juan Pérez', '71234567', 'juan.perez@gmail.com'),
('Sandy Leiva', '77176466', 'sandy.leiva@gmail.com'),
('David Zeniz', '75331915', 'david.zeniz@gmail.com'),
('Ana López', '74567890', 'ana.lopez@gmail.com'),
('Jazmin Ramírez', '75678901', 'jazmin.ramirez@gmail.com');
GO


-- DATOS DE PRUEBA: PRODUCTO

INSERT INTO Producto (Nombre, Precio, Stock)
VALUES
('Laptop Lenovo IdeaPad', 2500.00, 10),
('Mouse Logitech', 80.00, 25),
('Teclado Mecánico', 180.00, 15),
('Monitor LG 24"', 750.00, 8),
('Audífonos JBL', 250.00, 20),
('Webcam Logitech', 320.00, 12),
('Disco SSD 1TB', 350.00, 18),
('Memoria RAM 16GB', 280.00, 14);
GO

SELECT * FROM CLIENTE
SELECT * FROM PRODUCTO