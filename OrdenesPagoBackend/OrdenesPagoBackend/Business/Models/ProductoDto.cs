namespace OrdenesPagoBackend.Business.Models
{
    public class ProductoDto
    {
        public int IdProducto { get; set; }

        public string Nombre { get; set; } = null!;

        public decimal Precio { get; set; }

        public int Stock { get; set; }
    }
}
