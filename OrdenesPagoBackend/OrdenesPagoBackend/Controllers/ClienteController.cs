using Microsoft.AspNetCore.Mvc;
using OrdenesPagoBackend.Business;

namespace OrdenesPagoBackend.Controllers
{
    [ApiController]
    [Route("api/clientes")]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteBusinessLogic _clientes;

        public ClienteController(
            ClienteBusinessLogic clientes)
        {
            _clientes = clientes;
        }

        [HttpGet]
        public IActionResult ObtenerClientes()
        {
           
            var clientes =
                    _clientes.ObtenerClientes();

            return Ok(clientes);
        
        }
    }
}
