using System;
using System.Collections.Generic;

namespace OrdenesPagoBackend.Data.Entities;

public partial class Orden
{
    public int IdOrden { get; set; }

    public int IdCliente { get; set; }

    public DateTime Fecha { get; set; }

    public decimal Total { get; set; }

    public string Estado { get; set; } = null!;

    public DateTime FechaRegistro { get; set; }

    public DateTime FechaActualizacion { get; set; }

    public virtual ICollection<DetalleOrden> DetalleOrdenes { get; set; } = new List<DetalleOrden>();

    public virtual Cliente IdClienteNavigation { get; set; } = null!;
}
