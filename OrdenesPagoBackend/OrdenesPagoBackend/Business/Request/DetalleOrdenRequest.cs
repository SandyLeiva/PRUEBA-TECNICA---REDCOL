namespace OrdenesPagoBackend.Business.Request
{
    public class DetalleOrdenRequest
    {

        public int IdProducto { get; set; }

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }

    }
}
