import type { DetalleOrden } from "./DetalleOrden";

export interface Orden {
    idOrden: number;
    documento: string;
    clienteNombre: string;
    email: string;
    fecha: string;
    total: number;
    estado: string;
    detalleOrdenDtos: DetalleOrden[];
}

export interface OrdenRequest {
    idCliente: number;
    fecha: string;
    estado: string;
    detalleOrdenRequest: {
        idProducto: number;
        cantidad: number;
        precio: number;
    }[];
}

export interface EstadoOrdenRequest {
    estado: string;
}