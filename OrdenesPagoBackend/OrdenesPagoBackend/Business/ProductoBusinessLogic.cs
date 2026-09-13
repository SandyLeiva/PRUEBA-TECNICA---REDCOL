using Microsoft.EntityFrameworkCore;
using OrdenesPagoBackend.Business.Models;
using OrdenesPagoBackend.Interfaces;

namespace OrdenesPagoBackend.Business
{
    public class ProductoBusinessLogic
    {
        private readonly IRepositoryWrapper _repository;

        public ProductoBusinessLogic(IRepositoryWrapper repository)
        {
            _repository = repository;
        }

        public Response<List<ProductoDto>> ObtenerProductos()
        {
            var productoResponse = _repository.Producto
               .FindAll()
               .AsNoTracking()
               .OrderBy(p => p.Nombre)
               .Select(p => new ProductoDto
               {
                   IdProducto = p.IdProducto,
                   Nombre = p.Nombre,
                   Precio = p.Precio,
                   Stock = p.Stock,
               })
               .ToList();

            if (productoResponse.Count < 0)
            {
                return new Response<List<ProductoDto>>
                {
                    Status = 404,
                    Message = "No existe registro de productos",
                    Data = new List<ProductoDto>(),
                    Details = "No hay registros"
                };
            }

            return new Response<List<ProductoDto>>
            {
                Status = 200,
                Message = "Productos obtenidos correctamente",
                Data = productoResponse,
                Details = "Consulta exitosa"
            };

        }
    }
}
