using Microsoft.EntityFrameworkCore;
using OrdenesPagoBackend.Business.Models;
using OrdenesPagoBackend.Business.Request;
using OrdenesPagoBackend.Business.Validator;
using OrdenesPagoBackend.Data.Entities;
using OrdenesPagoBackend.Interfaces;
using System.Globalization;

namespace OrdenesPagoBackend.Business
{
    public class OrdenBusinessLogic
    {
        private readonly IRepositoryWrapper _repository;
        private readonly OrdenValidator _ordenValidator;
        private readonly EditarEstadoOrdenValidator _estadoOrdenValidator;


        public OrdenBusinessLogic(
            IRepositoryWrapper repository,
            OrdenValidator ordenValidator,
            EditarEstadoOrdenValidator estadoOrdenValidator)
        {
            _repository = repository;
            _ordenValidator = ordenValidator;
            _estadoOrdenValidator = estadoOrdenValidator;
        }

        public Response<List<OrdenDto>> ObtenerOrdenes()
        {
            var ordenResponse = _repository.Orden
               .FindAll()
               .AsNoTracking()
               .OrderByDescending(o => o.FechaRegistro)
               .Select(o => new OrdenDto
               {
                   IdOrden = o.IdOrden,
                   Documento = o.IdClienteNavigation.Documento,
                   ClienteNombre = o.IdClienteNavigation.Nombre,
                   Fecha = o.Fecha,
                   Total = o.Total,
                   Estado = o.Estado
               })
               .ToList();

            if (ordenResponse.Count < 0)
            {
                return new Response<List<OrdenDto>>
                {
                    Status = 404,
                    Message = "No existe registro de ordenes",
                    Data = new List<OrdenDto>(),
                    Details = "No hay registros"
                };
            }

            return new Response<List<OrdenDto>>
            {
                Status = 200,
                Message = "Ordenes obtenidas correctamente",
                Data = ordenResponse,
                Details = "Consulta exitosa"
            };

        }

        public Response<OrdenDto?> ObtenerDetalleDeOrden(int idOrden)
        {
            var ordenResponse = _repository.Orden
                .FindAll()
                .AsNoTracking()
                .Where(o => o.IdOrden == idOrden)
                .Select(o => new OrdenDto
                {
                    IdOrden = o.IdOrden,
                    ClienteNombre = o.IdClienteNavigation.Nombre,
                    Documento = o.IdClienteNavigation.Documento,
                    Email = o.IdClienteNavigation.Email ?? "",
                    Fecha = o.Fecha,
                    Total = o.Total,
                    Estado = o.Estado,

                    detalleOrdenDtos = o.DetalleOrdenes
                        .Select(d => new DetalleOrdenDto
                        {
                            IdDetalle = d.IdDetalle,
                            NombreProducto = d.IdProductoNavigation.Nombre,
                            Cantidad = d.Cantidad,
                            Precio = d.Precio,
                            Subtotal = Math.Round(d.Cantidad * d.Precio, 4)
                        })
                        .ToList()
                })
                .FirstOrDefault();

            if (ordenResponse == null)
            {
                return new Response<OrdenDto?>
                {
                    Status = 404,
                    Message = "La orden no existe",
                    Data = null,
                    Details = "No existe registro"
                };
            }

            return new Response<OrdenDto?>
            {
                Status = 200,
                Message = "Orden obtenida correctamente",
                Data = ordenResponse,
                Details = "Consulta exitosa"
            };
        }

        private decimal CalcularTotalOrden(List<DetalleOrdenRequest> detalles)
        {
            decimal total = 0;

            foreach (var detalle in detalles)
            {
                total += detalle.Cantidad * detalle.Precio;
            }

            return total;
        }

        public Response<OrdenDto?> RegistrarOrden(OrdenRequest ordenRequest)
        {
            using var transaction = _repository.BeginTransaction();

            try
            {
                var validacion = _ordenValidator.ValidarOrden(ordenRequest);

                if (validacion != null)
                {
                    transaction.Rollback();
                    return validacion;
                }

                var cliente = _repository.Cliente
                    .FindByCondition(c => c.IdCliente == ordenRequest.IdCliente)
                    .First();

                var fecha = DateTime.ParseExact(
                    ordenRequest.Fecha,
                    "yyyy-MM-ddTHH:mm:ss",
                    CultureInfo.InvariantCulture
                );

                var orden = new Orden
                {
                    IdCliente = ordenRequest.IdCliente,
                    Fecha = fecha,
                    Total = CalcularTotalOrden(
                        ordenRequest.DetalleOrdenRequest
                    ),
                    Estado = ordenRequest.Estado,
                    FechaRegistro = DateTime.Now,
                    FechaActualizacion = DateTime.Now
                };

                _repository.Orden.Create(orden);
                _repository.save();

                var detallesDto = new List<DetalleOrdenDto>();

                foreach (var detalleRequest in ordenRequest.DetalleOrdenRequest)
                {
                    var producto = _repository.Producto
                        .FindByCondition(
                            p => p.IdProducto == detalleRequest.IdProducto
                        )
                        .First();

                    producto.Stock -= detalleRequest.Cantidad;

                    _repository.Producto.Update(producto);

                    var detalle = new DetalleOrden
                    {
                        IdOrden = orden.IdOrden,
                        IdProducto = producto.IdProducto,
                        NombreProducto = producto.Nombre ?? "",
                        Cantidad = detalleRequest.Cantidad,
                        Precio = detalleRequest.Precio,
                        Subtotal =
                            detalleRequest.Cantidad *
                            detalleRequest.Precio
                    };

                    _repository.DetalleOrden.Create(detalle);
                    _repository.save();

                    detallesDto.Add(new DetalleOrdenDto
                    {
                        IdDetalle = detalle.IdDetalle,
                        NombreProducto = detalle.NombreProducto,
                        Cantidad = detalle.Cantidad,
                        Precio = detalle.Precio,
                        Subtotal = detalle.Subtotal
                    });
                }

                var ordenDto = new OrdenDto
                {
                    IdOrden = orden.IdOrden,
                    Documento = cliente.Documento,
                    ClienteNombre = cliente.Nombre,
                    Email = cliente.Email ?? "",
                    Fecha = orden.Fecha,
                    Total = orden.Total,
                    Estado = orden.Estado,
                    detalleOrdenDtos = detallesDto
                };

                transaction.Commit();

                return new Response<OrdenDto?>
                {
                    Status = 200,
                    Message = "Orden creada correctamente",
                    Data = ordenDto,
                    Details = "Registro exitoso"
                };
            }
            catch (Exception ex)
            {
                transaction.Rollback();

                return new Response<OrdenDto?>
                {
                    Status = 500,
                    Message = "Error al registrar la orden",
                    Data = null,
                    Details = ex.Message
                };
            }
        }

        public Response<OrdenDto> EditarEstadoOrden(int idOrden,EstadoOrdenRequest estadoOrdenRequest)
        {

            var validacion = _estadoOrdenValidator.ValidarCambioEstadoOrden(idOrden, estadoOrdenRequest);

            if (validacion != null)
            {
                return validacion;
            }

            var orden = _repository.Orden
                .FindByCondition(o => o.IdOrden == idOrden)
                .Include(o => o.IdClienteNavigation)
                .FirstOrDefault();

            orden.Estado = estadoOrdenRequest.Estado;
            orden.FechaActualizacion = DateTime.Now;

            _repository.Orden.Update(orden);
            _repository.save();

            var ordenDto = new OrdenDto
            {
                IdOrden = orden.IdOrden,
                Documento = orden.IdClienteNavigation.Documento,
                ClienteNombre = orden.IdClienteNavigation.Nombre,
                Email = orden.IdClienteNavigation.Email ?? "",
                Fecha = orden.Fecha,
                Total = orden.Total,
                Estado = orden.Estado
            };

            return new Response<OrdenDto>
            {
                Status = 200,
                Message = "Orden actualizada correctamente",
                Data = ordenDto,
                Details = "Consulta exitosa"
            };
        }


    }
}
