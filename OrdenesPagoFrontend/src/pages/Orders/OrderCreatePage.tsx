import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerClientes } from "../../services/clienteService";
import { obtenerProductos } from "../../services/productoService";
import { registrarOrden } from "../../services/ordenService";

import type { Cliente } from "../../models/Cliente";
import type { Producto } from "../../models/Producto";
import type { OrdenRequest } from "../../models/Orden";

import Loading from "../../components/Loading";
import FloatingAlert from "../../components/FloatingAlert";

import {
  ArrowLeft,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Save,
} from "lucide-react";

function OrderCreatePage() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [idCliente, setIdCliente] = useState<number>(0);

  const [busquedaCliente, setBusquedaCliente] = useState<string>("");
  const [mostrarClientes, setMostrarClientes] = useState<boolean>(false);

  const [busquedaProducto, setBusquedaProducto] = useState<string>("");
  const [mostrarProductos, setMostrarProductos] = useState<boolean>(false);

  const [detalles, setDetalles] = useState<
    {
      idProducto: number;
      nombreProducto: string;
      cantidad: number;
      precio: number;
      subtotal: number;
    }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [clientesResponse, productosResponse] = await Promise.all([
        obtenerClientes(),
        obtenerProductos(),
      ]);

      if (clientesResponse.status === 200) {
        setClientes(clientesResponse.data);
      } else {
        setError(
          clientesResponse.message || "No se pudieron obtener los clientes",
        );

        return;
      }

      if (productosResponse.status === 200) {
        setProductos(productosResponse.data);
      } else {
        setError(
          productosResponse.message || "No se pudieron obtener los productos",
        );
      }
    } catch (error: any) {
      console.error("Error al cargar datos:", error);

      const mensaje =
        error.response?.data?.message || "Ocurrió un error al cargar los datos";

      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const normalizarTexto = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const productosFiltrados = productos
    .filter((producto) => {
      const termino = normalizarTexto(busquedaProducto);

      const nombre = normalizarTexto(producto.nombre);

      return nombre.includes(termino);
    })
    .slice(0, 6);

  const clientesFiltrados = clientes
    .filter((cliente) => {
      const termino = normalizarTexto(busquedaCliente);
      const nombre = normalizarTexto(cliente.nombre);
      const documento = String(cliente.documento);

      return nombre.includes(termino) || documento.includes(termino);
    })
    .slice(0, 6);

  const seleccionarCliente = (cliente: Cliente) => {
    setIdCliente(cliente.idCliente);

    setBusquedaCliente(`${cliente.documento} - ${cliente.nombre}`);

    setMostrarClientes(false);
    setError("");
  };

  const agregarProducto = (producto: Producto) => {
    setError("");

    if (producto.stock <= 0) {
      setError(`${producto.nombre} no tiene stock disponible`);

      return;
    }

    setDetalles((detallesActuales) => {
      const existente = detallesActuales.find(
        (detalle) => detalle.idProducto === producto.idProducto,
      );

      if (existente) {
        return detallesActuales.map((detalle) => {
          if (detalle.idProducto !== producto.idProducto) {
            return detalle;
          }

          const nuevaCantidad = detalle.cantidad + 1;

          return {
            ...detalle,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * detalle.precio,
          };
        });
      }

      return [
        ...detallesActuales,
        {
          idProducto: producto.idProducto,
          nombreProducto: producto.nombre,
          cantidad: 1,
          precio: Number(producto.precio),
          subtotal: Number(producto.precio),
        },
      ];
    });

    setBusquedaProducto("");
    setMostrarProductos(false);
  };

  const cambiarCantidad = (idProducto: number, cambio: number) => {
    setDetalles((detallesActuales) =>
      detallesActuales.map((detalle) => {
        if (detalle.idProducto !== idProducto) {
          return detalle;
        }

        const nuevaCantidad = Math.max(1, detalle.cantidad + cambio);

        return {
          ...detalle,
          cantidad: nuevaCantidad,
          subtotal: nuevaCantidad * detalle.precio,
        };
      }),
    );
  };

  const eliminarProducto = (idProducto: number) => {
    setDetalles((detallesActuales) =>
      detallesActuales.filter((detalle) => detalle.idProducto !== idProducto),
    );
  };

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
  };

  const guardarOrden = async () => {
    setError("");

    if (idCliente === 0) {
      setError("Debe seleccionar un cliente");
      return;
    }

    if (detalles.length === 0) {
      setError("Debe agregar al menos un producto");
      return;
    }

    try {
      setGuardando(true);

      const ordenRequest: OrdenRequest = {
        idCliente,
        fecha: new Date().toISOString().slice(0, 19),

        estado: "Pendiente",

        detalleOrdenRequest: detalles.map((detalle) => ({
          idProducto: detalle.idProducto,
          cantidad: detalle.cantidad,
          precio: detalle.precio,
        })),
      };

      const response = await registrarOrden(ordenRequest);

      if (response.status === 200 || response.status === 201) {
        const idOrdenCreada = response.data?.idOrden;

        if (idOrdenCreada) {
          navigate(`/ordenes/${idOrdenCreada}`, {
            replace: true,
          });
        } else {
          setError(
            "La orden se registró, pero no se pudo obtener su identificador.",
          );
        }
      } else {
        setError(response.message || "No se pudo registrar la orden");
      }
    } catch (error: any) {
      console.error("Error al registrar orden:", error);

      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error al registrar la orden";

      setError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="order-create-page">
        <Loading message="Cargando datos..." />
      </div>
    );
  }

  return (
    <div className="order-create-page">
      <FloatingAlert message={error} onClose={() => setError("")} />

      <div className="order-create-header">
        <div className="page-title-row">
          <div className="page-title-icon">
            <ShoppingCart size={24} />
          </div>

          <div>
            <h1>Nueva orden</h1>
            <p>Registra una nueva orden de pago.</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/ordenes")}
        >
          <ArrowLeft size={17} />
          Volver
        </button>
      </div>

      <div className="create-card">
        <div className="create-card-header">
          <div>
            <h2>Datos de la orden</h2>
            <span>Selecciona el cliente y agrega los productos.</span>
          </div>
        </div>

        <div className="create-form">
          <div className="create-field">
            <label>Cliente</label>

            <div className="product-search-wrapper">
              <div className="product-search-input">
                <Search size={18} />

                <input
                  type="text"
                  value={busquedaCliente}
                  placeholder="Buscar por nombre o documento..."
                  onFocus={() => setMostrarClientes(true)}
                  onChange={(e) => {
                    setBusquedaCliente(e.target.value);

                    setIdCliente(0);
                    setMostrarClientes(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setMostrarClientes(false);
                    }, 150);
                  }}
                />
              </div>

              {mostrarClientes && (
                <div className="product-search-results">
                  {clientesFiltrados.length === 0 ? (
                    <div className="product-search-empty">
                      No se encontraron clientes.
                    </div>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <button
                        type="button"
                        className="product-search-item client-search-item"
                        key={cliente.idCliente}
                        onMouseDown={() => seleccionarCliente(cliente)}
                      >
                        <div>
                          <strong>{cliente.nombre}</strong>

                          <span>Documento: {cliente.documento}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="create-field">
            <label>Agregar producto</label>

            <div className="product-search-wrapper">
              <div className="product-search-input">
                <Search size={18} />

                <input
                  type="text"
                  value={busquedaProducto}
                  placeholder="Buscar producto..."
                  onFocus={() => setMostrarProductos(true)}
                  onChange={(e) => {
                    setBusquedaProducto(e.target.value);

                    setMostrarProductos(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setMostrarProductos(false);
                    }, 150);
                  }}
                />
              </div>

              {mostrarProductos && (
                <div className="product-search-results">
                  {productosFiltrados.length === 0 ? (
                    <div className="product-search-empty">
                      No se encontraron productos.
                    </div>
                  ) : (
                    productosFiltrados.map((producto) => {
                      const sinStock = producto.stock <= 0;

                      return (
                        <button
                          type="button"
                          key={producto.idProducto}
                          className={`product-search-item ${
                            sinStock ? "product-out-of-stock" : ""
                          }`}
                          disabled={sinStock}
                          onMouseDown={() => {
                            if (!sinStock) {
                              agregarProducto(producto);
                            }
                          }}
                        >
                          <div>
                            <strong>{producto.nombre}</strong>

                            <span>
                              {sinStock
                                ? "Sin stock"
                                : `Stock disponible: ${producto.stock}`}
                            </span>
                          </div>

                          <strong>
                            S/ {Number(producto.precio).toFixed(2)}
                          </strong>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="create-card">
        <div className="create-card-header">
          <div>
            <h2>Productos de la orden</h2>

            <span>
              {detalles.length}{" "}
              {detalles.length === 1
                ? "producto agregado"
                : "productos agregados"}
            </span>
          </div>
        </div>

        {detalles.length === 0 ? (
          <div className="create-empty-products">
            <ShoppingCart size={28} />

            <strong>Aún no agregaste productos</strong>

            <span>
              Busca un producto por nombre y selecciónalo para añadirlo.
            </span>
          </div>
        ) : (
          <>
            <div className="create-table-container">
              <table className="create-products-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {detalles.map((detalle) => (
                    <tr key={detalle.idProducto}>
                      <td>
                        <strong>{detalle.nombreProducto}</strong>
                      </td>

                      <td>
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(detalle.idProducto, -1)
                            }
                            disabled={detalle.cantidad === 1}
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={15} />
                          </button>

                          <span>{detalle.cantidad}</span>

                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(detalle.idProducto, 1)
                            }
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </td>

                      <td>S/ {detalle.precio.toFixed(2)}</td>

                      <td>
                        <strong>S/ {detalle.subtotal.toFixed(2)}</strong>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn-remove-product"
                          onClick={() => eliminarProducto(detalle.idProducto)}
                          aria-label={`Eliminar ${detalle.nombreProducto}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="create-total">
              <span>Total de la orden</span>

              <strong>S/ {calcularTotal().toFixed(2)}</strong>
            </div>
          </>
        )}
      </div>

      <div className="create-actions">
        <button
          type="button"
          className="btn-create-cancel"
          onClick={() => navigate("/ordenes")}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={guardarOrden}
          disabled={guardando}
        >
          <Save size={17} />

          {guardando ? "Registrando..." : "Registrar orden"}
        </button>
      </div>
    </div>
  );
}

export default OrderCreatePage;
