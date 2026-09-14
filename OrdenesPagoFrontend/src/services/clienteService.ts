import axios from "axios";
import type { Cliente } from "../models/Cliente";
import type { ApiResponse } from "../models/ApiResponse";

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerClientes = async (): Promise<ApiResponse<Cliente[]>> => {
    const response = await axios.get<ApiResponse<Cliente[]>>(
        `${API_URL}/clientes`
    );

    return response.data;
};