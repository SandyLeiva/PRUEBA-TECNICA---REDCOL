namespace OrdenesPagoBackend.Business.Models
{
    public class OrdenDto
    {
        public int IdOrden { get; set; }

        public string Documento { get; set; }

        public string ClienteNombre { get; set; }

        public string Email { get; set; }

        public DateTime Fecha { get; set; }

        public decimal Total { get; set; }

        public string Estado { get; set; } = null!;
         
        public List<DetalleOrdenDto> detalleOrdenDtos  { get; set; } = new List<DetalleOrdenDto>();
    }
}
