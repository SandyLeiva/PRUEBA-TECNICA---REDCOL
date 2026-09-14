import axios from "axios";
import type { Producto } from "../models/Producto";
import type { ApiResponse } from "../models/ApiResponse";

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerProductos = async (): Promise<ApiResponse<Producto[]>> => {
    const response = await axios.get<ApiResponse<Producto[]>>(
        `${API_URL}/productos`
    );

    return response.data;
};