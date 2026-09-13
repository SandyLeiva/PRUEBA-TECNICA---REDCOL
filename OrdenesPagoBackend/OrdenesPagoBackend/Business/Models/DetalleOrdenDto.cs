namespace OrdenesPagoBackend.Business.Models
{
    public class DetalleOrdenDto
    {
        public int IdDetalle { get; set; }

        public int IdOrden { get; set; }

        public string NombreProducto { get; set; } = null!;

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }

        public decimal Subtotal { get; set; }
    }
}
