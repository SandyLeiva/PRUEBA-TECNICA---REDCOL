using Microsoft.EntityFrameworkCore;
using OrdenesPagoBackend.Business.Models;
using OrdenesPagoBackend.Interfaces;

namespace OrdenesPagoBackend.Business
{
    public class ClienteBusinessLogic
    {
        private readonly IRepositoryWrapper _repository;

        public ClienteBusinessLogic(IRepositoryWrapper repository)
        {
            _repository = repository;
        }

        public Response<List<ClienteDto>> ObtenerClientes()
        {
            var clienteResponse = _repository.Cliente
               .FindAll()
               .AsNoTracking()
               .OrderBy(c => c.Nombre)
               .Select(c => new ClienteDto
               {
                   IdCliente = c.IdCliente,
                   Nombre = c.Nombre,
                   Documento = c.Documento,
                   Email = c.Email,
               })
               .ToList();

            if (clienteResponse.Count < 0)
            {
                return new Response<List<ClienteDto>>
                {
                    Status = 404,
                    Message = "No existe registro de clientes",
                    Data = new List<ClienteDto>(),
                    Details = "No hay registros"
                };
            }

            return new Response<List<ClienteDto>>
            {
                Status = 200,
                Message = "Clientes obtenidos correctamente",
                Data = clienteResponse,
                Details = "Consulta exitosa"
            };


        }

    }
}
