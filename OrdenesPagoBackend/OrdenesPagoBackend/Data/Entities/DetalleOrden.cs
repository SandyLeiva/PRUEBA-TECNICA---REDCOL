using System;
using System.Collections.Generic;

namespace OrdenesPagoBackend.Data.Entities;

public partial class DetalleOrden
{
    public int IdDetalle { get; set; }

    public int IdOrden { get; set; }

    public int IdProducto { get; set; }

    public string NombreProducto { get; set; } = null!;

    public int Cantidad { get; set; }

    public decimal Precio { get; set; }

    public decimal Subtotal { get; set; }

    public virtual Orden IdOrdenNavigation { get; set; } = null!;

    public virtual Producto IdProductoNavigation { get; set; } = null!;
}
