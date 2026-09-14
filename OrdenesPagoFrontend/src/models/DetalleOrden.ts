export interface DetalleOrden {
    idDetalle: number;
    idOrden: number;
    nombreProducto: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

export interface DetalleOrdenRequest {
    idProducto: number;
    cantidad: number;
    precio: number;
}