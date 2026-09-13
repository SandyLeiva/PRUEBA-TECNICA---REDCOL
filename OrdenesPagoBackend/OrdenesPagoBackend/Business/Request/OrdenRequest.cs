using OrdenesPagoBackend.Business.Models;

namespace OrdenesPagoBackend.Business.Request
{
    public class OrdenRequest
    {
        public int IdCliente { get; set; }

        public string Fecha { get; set; }

        public decimal Total { get; set; }

        public string Estado { get; set; } = null!;

        public List<DetalleOrdenRequest> DetalleOrdenRequest { get; set; } = new List<DetalleOrdenRequest>();

    }
}
