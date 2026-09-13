using Microsoft.AspNetCore.Mvc;
using OrdenesPagoBackend.Business;

namespace OrdenesPagoBackend.Controllers
{
    [ApiController]
    [Route("api/productos")]
    public class ProductoController : ControllerBase
    {

        private readonly ProductoBusinessLogic _productos;

        public ProductoController(
            ProductoBusinessLogic productos)
        {
            _productos = productos;
        }

        [HttpGet]
        public IActionResult ObtenerProductos()
        {

            var productos =
                    _productos.ObtenerProductos();

            return Ok(productos);
            
        }

    }
}
