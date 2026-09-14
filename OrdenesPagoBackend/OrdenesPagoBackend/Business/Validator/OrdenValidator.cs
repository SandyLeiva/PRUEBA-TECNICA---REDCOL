using OrdenesPagoBackend.Business.Models;
using OrdenesPagoBackend.Business.Request;
using OrdenesPagoBackend.Interfaces;
using System.Globalization;

namespace OrdenesPagoBackend.Business.Validator
{
    public class OrdenValidator
    {
        private readonly IRepositoryWrapper _repository;

        public OrdenValidator(IRepositoryWrapper repository)
        {
            _repository = repository;
        }

        public Response<OrdenDto?>? ValidarOrden(OrdenRequest ordenRequest)
        {
            if (!DateTime.TryParseExact(
                    ordenRequest.Fecha,
                    "yyyy-MM-ddTHH:mm:ss",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out _))
            {
                return new Response<OrdenDto?>
                {
                    Status = 400,
                    Message = "Formato de fecha inválido",
                    Data = null,
                    Details = "La fecha debe tener el formato yyyy-MM-ddTHH:mm:ss"
                };
            }

            var cliente = _repository.Cliente
                .FindByCondition(c => c.IdCliente == ordenRequest.IdCliente)
                .FirstOrDefault();

            if (cliente == null)
            {
                return new Response<OrdenDto?>
                {
                    Status = 404,
                    Message = "El cliente no existe",
                    Data = null,
                    Details = "No se encontró el cliente solicitado"
                };
            }

            if (ordenRequest.DetalleOrdenRequest == null ||
                ordenRequest.DetalleOrdenRequest.Count == 0)
            {
                return new Response<OrdenDto?>
                {
                    Status = 400,
                    Message = "La orden no tiene detalles",
                    Data = null,
                    Details = "Debe registrar al menos un producto en la orden"
                };
            }

            if (ordenRequest.Estado != "Pendiente" &&
                ordenRequest.Estado != "Anulada" &&
                ordenRequest.Estado != "Pagada")
            {
                return new Response<OrdenDto?>
                {
                    Status = 400,
                    Message = "Estado de orden inválido",
                    Data = null,
                    Details = "Los estados permitidos son Pendiente, Anulada y Pagada"
                };
            }

            foreach (var detalle in ordenRequest.DetalleOrdenRequest)
            {
                if (detalle.Cantidad <= 0)
                {
                    return new Response<OrdenDto?>
                    {
                        Status = 400,
                        Message = "Cantidad inválida",
                        Data = null,
                        Details = "La cantidad de los productos debe ser mayor a cero"
                    };
                }

                if (detalle.Precio < 0)
                {
                    return new Response<OrdenDto?>
                    {
                        Status = 400,
                        Message = "Precio inválido",
                        Data = null,
                        Details = "El precio de los productos no puede ser negativo"
                    };
                }
            }

            var productosSolicitados = ordenRequest.DetalleOrdenRequest
                .GroupBy(d => d.IdProducto)
                .Select(g => new
                {
                    IdProducto = g.Key,
                    Cantidad = g.Sum(d => d.Cantidad)
                })
                .ToList();

            foreach (var item in productosSolicitados)
            {
                var producto = _repository.Producto
                    .FindByCondition(p => p.IdProducto == item.IdProducto)
                    .FirstOrDefault();

                if (producto == null)
                {
                    return new Response<OrdenDto?>
                    {
                        Status = 404,
                        Message = "El producto no existe",
                        Data = null,
                        Details = $"No se encontró el producto con ID {item.IdProducto}"
                    };
                }

                if (producto.Stock < item.Cantidad)
                {
                    return new Response<OrdenDto?>
                    {
                        Status = 400,
                        Message = $"Stock insuficiente para {producto.Nombre}",
                        Data = null,
                        Details = $"Stock disponible: {producto.Stock}. Cantidad solicitada: {item.Cantidad}"
                    };
                }
            }

            return null;
        }
    }
}
