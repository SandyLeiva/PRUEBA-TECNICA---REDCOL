import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerOrdenes } from "../../services/ordenService";
import type { Orden } from "../../models/Orden";

import {
  ClipboardList,
  Clock3,
  CircleCheck,
  CircleX,
  WalletCards,
  Plus,
  ArrowRight,
  Search,
} from "lucide-react";

import Loading from "../../components/Loading";
import FloatingAlert from "../../components/FloatingAlert";

function OrdersPage() {
  const navigate = useNavigate();

  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [cargaCorrecta, setCargaCorrecta] =
    useState<boolean>(false);

  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      setError("");
      setCargaCorrecta(false);

      const response = await obtenerOrdenes();

      if (response.status === 200) {
        setOrdenes(response.data);
        setCargaCorrecta(true);
      } else {
        setError(
          response.message ||
            "No se pudieron obtener las órdenes",
        );
      }
    } catch (error: any) {
      console.error(
        "Error al obtener las órdenes:",
        error,
      );

      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error al obtener las órdenes";

      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = (idOrden: number) => {
    navigate(`/ordenes/${idOrden}`);
  };

  const nuevaOrden = () => {
    navigate("/ordenes/nueva");
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

  const pendientes = ordenes.filter(
    (orden) =>
      orden.estado.toUpperCase() === "PENDIENTE",
  ).length;

  const pagadas = ordenes.filter(
    (orden) =>
      orden.estado.toUpperCase() === "PAGADA",
  ).length;

  const anuladas = ordenes.filter(
    (orden) =>
      orden.estado.toUpperCase() === "ANULADA",
  ).length;

  const montoTotal = ordenes.reduce(
    (total, orden) =>
      total + Number(orden.total),
    0,
  );

  const normalizarTexto = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const ordenesFiltradas = ordenes.filter(
    (orden) => {
      const termino = normalizarTexto(busqueda);

      const nombre = normalizarTexto(
        orden.clienteNombre || "",
      );

      const documento = String(
        orden.documento || "",
      ).toLowerCase();

      return (
        nombre.includes(termino) ||
        documento.includes(termino)
      );
    },
  );

  return (
    <div className="orders-page">
      {/* ALERTA */}

      <FloatingAlert
        message={error}
        onClose={() => setError("")}
      />

      {/* HEADER */}

      <div className="orders-header">
        <div className="page-title-row">
          <div>
            <h1>Órdenes de pago</h1>

            <p>
              Consulta y administra las órdenes
              registradas.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={nuevaOrden}
        >
          <Plus size={18} />
          Nueva orden
        </button>
      </div>

      {/* LOADING */}

      {loading && (
        <Loading message="Cargando órdenes..." />
      )}

      {/* CONTENIDO */}

      {!loading && cargaCorrecta && (
        <>
          {/* RESUMEN */}

          <div className="orders-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <ClipboardList size={21} />
              </div>

              <div>
                <span>Total de órdenes</span>
                <strong>{ordenes.length}</strong>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon pending-icon">
                <Clock3 size={21} />
              </div>

              <div>
                <span>Pendientes</span>
                <strong>{pendientes}</strong>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon paid-icon">
                <CircleCheck size={21} />
              </div>

              <div>
                <span>Pagadas</span>
                <strong>{pagadas}</strong>
              </div>
            </div>

            <div className="summary-card cancelled-card">
              <div className="summary-icon cancelled-icon">
                <CircleX size={21} />
              </div>

              <div>
                <span>Anuladas</span>
                <strong>{anuladas}</strong>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon total-icon">
                <WalletCards size={21} />
              </div>

              <div>
                <span>Monto total</span>

                <strong>
                  S/ {montoTotal.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>

          {/* LISTADO */}

          <div className="orders-card">
            <div className="orders-card-header">
              <div>
                <h2>Listado de órdenes</h2>

                <span>
                  {busqueda
                    ? `${ordenesFiltradas.length} resultados encontrados`
                    : `${ordenes.length} ${
                        ordenes.length === 1
                          ? "registro"
                          : "registros"
                      }`}
                </span>
              </div>

              <div className="orders-search">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Buscar por documento o cliente..."
                  value={busqueda}
                  onChange={(e) =>
                    setBusqueda(e.target.value)
                  }
                  aria-label="Buscar órdenes por documento o cliente"
                />
              </div>
            </div>

            {ordenes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Plus size={22} />
                </div>

                <strong>
                  No hay órdenes registradas
                </strong>

                <span>
                  Crea una nueva orden para comenzar.
                </span>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={nuevaOrden}
                >
                  <Plus size={17} />
                  Nueva orden
                </button>
              </div>
            ) : ordenesFiltradas.length === 0 ? (
              <div className="search-empty-state">
                <Search size={28} />

                <strong>
                  No encontramos resultados
                </strong>

                <span>
                  No hay órdenes que coincidan con "
                  {busqueda}".
                </span>

                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setBusqueda("")}
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {ordenesFiltradas.map(
                      (orden) => (
                        <tr key={orden.idOrden}>
                          <td>
                            <div className="client-cell">
                              <strong>
                                {orden.documento} -{" "}
                                {orden.clienteNombre}
                              </strong>
                            </div>
                          </td>

                          <td>
                            <span className="date-text">
                              {new Date(
                                orden.fecha,
                              ).toLocaleDateString(
                                "es-PE",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </td>

                          <td>
                            <strong className="amount-text">
                              S/{" "}
                              {Number(
                                orden.total,
                              ).toFixed(2)}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={obtenerClaseEstado(
                                orden.estado,
                              )}
                            >
                              <span className="status-dot"></span>
                              {orden.estado}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="btn-detail"
                              onClick={() =>
                                verDetalle(
                                  orden.idOrden,
                                )
                              }
                            >
                              Ver detalle
                              <ArrowRight
                                size={15}
                              />
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default OrdersPage;