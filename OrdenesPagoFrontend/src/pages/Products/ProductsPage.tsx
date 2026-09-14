import { useEffect, useState } from "react";

import { obtenerProductos } from "../../services/productoService";

import type { Producto } from "../../models/Producto";

import {
  Package,
  Search,
  PackageSearch,
} from "lucide-react";

import Loading from "../../components/Loading";
import FloatingAlert from "../../components/FloatingAlert";

function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [cargaCorrecta, setCargaCorrecta] =
    useState<boolean>(false);

  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError("");
      setCargaCorrecta(false);

      const response = await obtenerProductos();

      if (response.status === 200) {
        setProductos(response.data);
        setCargaCorrecta(true);
      } else {
        setError(
          response.message ||
            "No se pudieron obtener los productos",
        );
      }
    } catch (error: any) {
      console.error(
        "Error al obtener productos:",
        error,
      );

      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error al obtener los productos";

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

  const productosFiltrados = productos.filter(
    (producto) => {
      const termino = normalizarTexto(busqueda);

      const nombre = normalizarTexto(
        producto.nombre || "",
      );

      return nombre.includes(termino);
    },
  );

  const obtenerClaseStock = (stock: number) => {
    if (stock < 10) {
      return "stock-badge stock-low";
    }

    if (stock < 15) {
      return "stock-badge stock-medium";
    }

    return "stock-badge stock-good";
  };

  if (loading) {
    return (
      <div className="products-page">
        <Loading message="Cargando productos..." />
      </div>
    );
  }

  return (
    <div className="products-page">
      <FloatingAlert
        message={error}
        onClose={() => setError("")}
      />

      {/* HEADER */}

      <div className="products-header">
        <div className="page-title-row">
          <div className="page-title-icon">
            <Package size={25} />
          </div>

          <div>
            <h1>Productos</h1>

            <p>
              Consulta los productos registrados.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}

      {cargaCorrecta && (
        <div className="products-card">
          <div className="products-card-header">
            <div>
              <h2>Listado de productos</h2>

              <span>
                {productos.length}{" "}
                {productos.length === 1
                  ? "producto registrado"
                  : "productos registrados"}
              </span>
            </div>

            <div className="products-search">
              <Search size={17} />

              <input
                type="text"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Buscar producto..."
              />
            </div>
          </div>

          {productos.length === 0 ? (
            <div className="products-empty">
              <PackageSearch size={30} />

              <strong>
                No hay productos registrados
              </strong>

              <span>
                Los productos registrados aparecerán
                aquí.
              </span>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="products-empty">
              <Search size={28} />

              <strong>
                No encontramos resultados
              </strong>

              <span>
                Prueba buscando por nombre.
              </span>
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {productosFiltrados.map(
                    (producto) => (
                      <tr key={producto.idProducto}>
                        <td>
                          <strong>
                            {producto.nombre}
                          </strong>
                        </td>

                        <td>
                          <span className="product-price">
                            S/{" "}
                            {Number(
                              producto.precio,
                            ).toFixed(2)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={obtenerClaseStock(
                              producto.stock,
                            )}
                          >
                            {producto.stock} unidades
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;