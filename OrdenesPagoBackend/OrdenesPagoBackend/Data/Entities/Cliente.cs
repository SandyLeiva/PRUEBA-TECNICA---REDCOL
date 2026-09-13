using System;
using System.Collections.Generic;

namespace OrdenesPagoBackend.Data.Entities;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string Nombre { get; set; } = null!;

    public string Documento { get; set; } = null!;

    public string? Email { get; set; }

    public int Estado { get; set; }

    public DateTime FechaRegistro { get; set; }

    public DateTime FechaActualizacion { get; set; }
    public virtual ICollection<Orden> Ordenes { get; set; } = new List<Orden>();
}
