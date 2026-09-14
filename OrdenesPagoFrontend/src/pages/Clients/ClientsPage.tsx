import { useEffect, useState } from "react";
import { obtenerClientes } from "../../services/clienteService";
import type { Cliente } from "../../models/Cliente";
import { Users, Search, ContactRound } from "lucide-react";
import Loading from "../../components/Loading";
import FloatingAlert from "../../components/FloatingAlert";

function ClientsPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [cargaCorrecta, setCargaCorrecta] = useState<boolean>(false);

  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError("");
      setCargaCorrecta(false);

      const response = await obtenerClientes();

      if (response.status === 200) {
        setClientes(response.data);
        setCargaCorrecta(true);
      } else {
        setError(response.message || "No se pudieron obtener los clientes");
      }
    } catch (error: any) {
      console.error("Error al obtener clientes:", error);

      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error al obtener los clientes";

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

  const clientesFiltrados = clientes.filter((cliente) => {
    const termino = normalizarTexto(busqueda);

    const nombre = normalizarTexto(cliente.nombre || "");

    const documento = String(cliente.documento || "").toLowerCase();

    const email = normalizarTexto(cliente.email || "");

    return (
      nombre.includes(termino) ||
      documento.includes(termino) ||
      email.includes(termino)
    );
  });

  if (loading) {
    return (
      <div className="clients-page">
        <Loading message="Cargando clientes..." />
      </div>
    );
  }

  return (
    <div className="clients-page">
      <FloatingAlert message={error} onClose={() => setError("")} />

      {/* HEADER */}

      <div className="clients-header">
        <div className="page-title-row">
          <div className="page-title-icon">
            <Users size={25} />
          </div>

          <div>
            <h1>Clientes</h1>

            <p>Consulta los clientes registrados.</p>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}

      {cargaCorrecta && (
        <div className="clients-card">
          <div className="clients-card-header">
            <div>
              <h2>Listado de clientes</h2>

              <span>
                {clientes.length}{" "}
                {clientes.length === 1
                  ? "cliente registrado"
                  : "clientes registrados"}
              </span>
            </div>

            <div className="clients-search">
              <Search size={17} />

              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cliente..."
              />
            </div>
          </div>

          {clientes.length === 0 ? (
            <div className="clients-empty">
              <ContactRound size={30} />

              <strong>No hay clientes registrados</strong>

              <span>Los clientes registrados aparecerán aquí.</span>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="clients-empty">
              <Search size={28} />

              <strong>No encontramos resultados</strong>

              <span>Prueba buscando por nombre, documento o email.</span>
            </div>
          ) : (
            <div className="clients-table-container">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Documento</th>
                    <th>Nombre</th>
                    <th>Email</th>
                  </tr>
                </thead>

                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.idCliente}>
                      <td>
                        <span className="client-id">#{cliente.idCliente}</span>
                      </td>

                      <td>{cliente.documento}</td>

                      <td>
                        <strong>{cliente.nombre}</strong>
                      </td>

                      <td>
                        <span className="client-email">
                          {cliente.email || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientsPage;
