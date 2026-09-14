using OrdenesPagoBackend.Business.Models;
using OrdenesPagoBackend.Business.Request;
using OrdenesPagoBackend.Interfaces;
using System.Globalization;

namespace OrdenesPagoBackend.Business.Validator
{

    public class EditarEstadoOrdenValidator
    {
        private readonly IRepositoryWrapper _repository;

        public EditarEstadoOrdenValidator(IRepositoryWrapper repository)
        {
            _repository = repository;
        }

        public Response<OrdenDto>? ValidarCambioEstadoOrden(
            int idOrden,
            EstadoOrdenRequest estadoOrdenRequest)
        {
            var orden = _repository.Orden
                .FindByCondition(o => o.IdOrden == idOrden)
                .FirstOrDefault();

            if (orden == null)
            {
                return new Response<OrdenDto>
                {
                    Status = 404,
                    Message = "Orden no encontrada",
                    Data = null,
                    Details = "No existe una orden con el ID indicado"
                };
            }

            string estadoActual = orden.Estado?.ToUpper() ?? "";
            string nuevoEstado = estadoOrdenRequest.Estado?.ToUpper() ?? "";

            switch (estadoActual)
            {
                case "PENDIENTE":

                    switch (nuevoEstado)
                    {
                        case "PAGADA":
                        case "ANULADA":
                            return null; 

                        default:
                            return new Response<OrdenDto>
                            {
                                Status = 400,
                                Message = "Cambio de estado no permitido",
                                Data = null,
                                Details = "Una orden pendiente solo puede pasar a pagada o anulada"
                            };
                    }

                case "PAGADA":

                    switch (nuevoEstado)
                    {
                        case "ANULADA":
                            return null; 

                        default:
                            return new Response<OrdenDto>
                            {
                                Status = 400,
                                Message = "Cambio de estado no permitido",
                                Data = null,
                                Details = "Una orden pagada solo puede pasar a anulada"
                            };
                    }

                case "ANULADA":

                    return new Response<OrdenDto>
                    {
                        Status = 400,
                        Message = "No se puede cambiar el estado",
                        Data = null,
                        Details = "Una orden anulada no permite cambios de estado"
                    };

                default:

                    return new Response<OrdenDto>
                    {
                        Status = 400,
                        Message = "Estado actual no válido",
                        Data = null,
                        Details = "La orden tiene un estado no contemplado"
                    };
            }
        }
    }
}
