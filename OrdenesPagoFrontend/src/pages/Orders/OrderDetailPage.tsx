import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  obtenerOrdenPorId,
  actualizarEstadoOrden,
} from "../../services/ordenService";

import type { Orden } from "../../models/Orden";

import {
  ArrowLeft,
  ReceiptText,
  CircleCheck,
  CircleX,
  Package,
} from "lucide-react";

import Loading from "../../components/Loading";
import FloatingAlert from "../../components/FloatingAlert";

function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [actualizandoEstado, setActualizandoEstado] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      cargarOrden(Number(id));
    }
  }, [id]);

  const cargarOrden = async (
    idOrden: number,
    mostrarLoading: boolean = true,
  ) => {
    try {
      if (mostrarLoading) {
        setLoading(true);
      }
      setError("");

      const response = await obtenerOrdenPorId(idOrden);

      if (response.status === 200) {
        setOrden(response.data);
      } else {
        setError(response.message || "No se pudo obtener la orden");
      }
    } catch (error: any) {
      console.error("Error al obtener la orden:", error);

      const mensaje =
        error.response?.data?.message || "Ocurrió un error al obtener la orden";

      setError(mensaje);
    } finally {
      if (mostrarLoading) {
        setLoading(false);
      }
    }
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!orden) return;

    try {
      setActualizandoEstado(true);
      setError("");

      const response = await actualizarEstadoOrden(orden.idOrden, nuevoEstado);

      if (response.status === 200) {
        await cargarOrden(orden.idOrden, false);
      } else {
        setError(response.message || "No se pudo actualizar el estado");
      }
    } catch (error: any) {
      console.error("Error al actualizar el estado:", error);

      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error al actualizar el estado";

      setError(mensaje);
    } finally {
      setActualizandoEstado(false);
    }
  };

  const volver = () => {
    navigate("/ordenes");
  };

  const obtenerClaseEstado = (estado: string) => {
    switch (estado.toUpperCase()) {
      case "PENDIENTE":
        return "status-badge pending";
      case "PAGADA":
        return "status-badge paid";
      case "ANULADA":
        return "status-badge cancelled";
      default:
        return "status-badge";
    }
  };

  const estadoNormalizado = orden?.estado?.toUpperCase() || "";

  if (loading) {
    return (
      <div className="order-detail-page">
        <Loading message="Cargando detalle de la orden..." />
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="order-detail-page">
        <FloatingAlert message={error} onClose={() => setError("")} />

        <div className="detail-empty">
          <ReceiptText size={30} />

          <strong>No se encontró la orden</strong>
          <span>La orden solicitada no está disponible.</span>
          <button type="button" className="btn-back" onClick={volver}>
            <ArrowLeft size={17} />
            Volver a órdenes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div className="page-title-row">
          <div className="page-title-icon">
            <ReceiptText size={25} />
          </div>
          <div>
            <h1>Detalle de orden</h1>
            <p>Información de la orden</p>
          </div>
        </div>
        <button type="button" className="btn-back" onClick={volver}>
          <ArrowLeft size={17} />
          Volver
        </button>
      </div>

      <FloatingAlert message={error} onClose={() => setError("")} />

      <div className="detail-card">
        <div className="detail-card-header">
          <div>
            <h2>Orden N° {orden.idOrden}</h2>
          </div>

          <div className="order-header-data">
            <div className="order-header-item">
              <span>Fecha</span>

              <strong>
                {new Date(orden.fecha).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </strong>
            </div>

            <div className="order-header-item">
              <div>
                <span className={obtenerClaseEstado(orden.estado)}>
                  <span className="status-dot"></span>
                  {orden.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-info-simple">
          <div className="client-info-section">
            <h3>Datos del cliente</h3>

            <div className="client-info-grid">
              <div className="client-data-item">
                <span>Cliente</span>
                <strong>{orden.clienteNombre}</strong>
              </div>
              <div className="client-data-item">
                <span>Documento</span>
                <strong>{orden.documento}</strong>
              </div>
              <div className="client-data-item">
                <span>Email</span>
                <strong>{orden.email || "-"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-actions-card">
        <div>
          <h2>Estado de la orden</h2>
          <span>Actualiza el estado según corresponda.</span>
        </div>

        <div className="order-actions">
          {estadoNormalizado === "PENDIENTE" && (
            <>
              <button
                type="button"
                className="btn-status btn-status-paid"
                onClick={() => cambiarEstado("Pagada")}
                disabled={actualizandoEstado}
              >
                <CircleCheck size={17} />

                {actualizandoEstado ? "Actualizando..." : "Marcar como pagada"}
              </button>

              <button
                type="button"
                className="btn-status btn-status-cancel"
                onClick={() => cambiarEstado("Anulada")}
                disabled={actualizandoEstado}
              >
                <CircleX size={17} />

                {actualizandoEstado ? "Actualizando..." : "Anular orden"}
              </button>
            </>
          )}

          {estadoNormalizado === "PAGADA" && (
            <button
              type="button"
              className="btn-status btn-status-cancel"
              onClick={() => cambiarEstado("Anulada")}
              disabled={actualizandoEstado}
            >
              <CircleX size={17} />

              {actualizandoEstado ? "Actualizando..." : "Anular orden"}
            </button>
          )}

          {estadoNormalizado === "ANULADA" && (
            <div className="cancelled-notice">
              <CircleX size={18} />

              <span>
                Esta orden está anulada y ya no permite cambios de estado.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-card-header">
          <div className="detail-products-title">
            <Package size={19} />

            <div>
              <h2>Productos</h2>
              <span>
                {orden.detalleOrdenDtos.length}{" "}
                {orden.detalleOrdenDtos.length === 1 ? "producto" : "productos"}
              </span>
            </div>
          </div>
        </div>

        {orden.detalleOrdenDtos.length === 0 ? (
          <div className="detail-empty-products">
            No hay productos registrados en esta orden.
          </div>
        ) : (
          <div className="detail-table-container">
            <table className="detail-products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {orden.detalleOrdenDtos.map((detalle) => (
                  <tr key={detalle.idDetalle}>
                    <td>
                      <strong>{detalle.nombreProducto}</strong>
                    </td>
                    <td>{detalle.cantidad}</td>
                    <td>S/ {Number(detalle.precio).toFixed(2)}</td>
                    <td>
                      <strong>S/ {Number(detalle.subtotal).toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="order-total">
          <span>Total de la orden</span>
          <strong>S/ {Number(orden.total).toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
