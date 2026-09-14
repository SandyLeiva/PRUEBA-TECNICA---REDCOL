import axios from "axios";
import type { ApiResponse } from "../models/ApiResponse";
import type {
    Orden,
    OrdenRequest,
    EstadoOrdenRequest
} from "../models/Orden";

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todas las órdenes
export const obtenerOrdenes = async (): Promise<ApiResponse<Orden[]>> => {
    const response = await axios.get<ApiResponse<Orden[]>>(
        `${API_URL}/orden`
    );

    return response.data;
};

// Obtener una orden por ID
export const obtenerOrdenPorId = async (
    id: number
): Promise<ApiResponse<Orden>> => {
    const response = await axios.get<ApiResponse<Orden>>(
        `${API_URL}/orden/${id}`
    );

    return response.data;
};

// Registrar una nueva orden
export const registrarOrden = async (
    orden: OrdenRequest
): Promise<ApiResponse<Orden>> => {
    const response = await axios.post<ApiResponse<Orden>>(
        `${API_URL}/orden`,
        orden
    );

    return response.data;
};

// Actualizar estado de una orden
export const actualizarEstadoOrden = async (
    id: number,
    estado: string
): Promise<ApiResponse<Orden>> => {

    const request: EstadoOrdenRequest = {
        estado: estado
    };

    const response = await axios.put<ApiResponse<Orden>>(
        `${API_URL}/orden/estado/${id}`,
        request
    );

    return response.data;
};