using Microsoft.AspNetCore.Mvc;
using OrdenesPagoBackend.Business;
using OrdenesPagoBackend.Business.Request;

namespace OrdenesPagoBackend.Controllers

{
    [ApiController]
    [Route("api/orden")]
    public class OrdenController : ControllerBase
    {

        private readonly OrdenBusinessLogic _ordenes;

        public OrdenController(
            OrdenBusinessLogic ordenes)
        {
            _ordenes = ordenes;
        }

        [HttpGet]
        public IActionResult ObtenerOrdenes()
        {    
          var ordenes =
                    _ordenes.ObtenerOrdenes();

          return Ok(ordenes);  
        }


        [HttpGet("{idorden}")]
        public IActionResult ObtenerDetalleDeOrden(int idorden)
        {
 
           var orden =
               _ordenes.ObtenerDetalleDeOrden(idorden);

           return Ok(orden);
        }


        [HttpPost]
        public IActionResult RegistrarOrden(OrdenRequest ordenRequest)
        {
            var response = _ordenes.RegistrarOrden(ordenRequest);

            return Ok(response);
        }


        [HttpPut("estado/{idOrden}")]
        public IActionResult EditarEstadoOrden(int idOrden, EstadoOrdenRequest estadoOrdenRequest)
        {

            var response = _ordenes.EditarEstadoOrden(idOrden, estadoOrdenRequest);

            return Ok(response);

        }
               


    }
}
