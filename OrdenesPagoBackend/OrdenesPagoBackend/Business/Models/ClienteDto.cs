namespace OrdenesPagoBackend.Business.Models
{
    public class ClienteDto
    {
        public int IdCliente { get; set; }

        public string Documento { get; set; } = null!;

        public string Nombre { get; set; } = null!;

        public string? Email { get; set; }

    }
}
