using Microsoft.AspNetCore.Mvc;
using API.Models.Request;
using API.Models.Response;
using API.Services;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    /// <summary>
    /// Controlador para gestionar operaciones relacionadas con los foros.
    /// </summary>
    [ApiController]
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    public class ForoController : ControllerBase
    {
        private readonly LogicaForo _logica;

        /// <summary>
        /// Constructor del controlador de foro.
        /// </summary>
        /// <param name="logica">Instancia de la lógica de negocio para foros.</param>
        public ForoController(LogicaForo logica)
        {
            _logica = logica;
        }

        /// <summary>
        /// Crea un nuevo foro.
        /// </summary>
        /// <param name="req">Datos para crear el foro.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost("crearForo")]
        public async Task<ActionResult<ResCrearActualizarForo>> Crear([FromBody] ReqCrearForo req)
        {
            if (req == null)
            {
                return BadRequest(new ResCrearActualizarForo
                {
                    Resultado = false,
                    ListaDeErrores = new List<string> { "Request nulo" }
                });
            }

            var result = await _logica.CrearForoAsync(req);
            if (!result.Resultado)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Actualiza un foro existente.
        /// </summary>
        /// <param name="req">Datos para actualizar el foro.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut("actualizarForo")]
        public async Task<ActionResult<ResCrearActualizarForo>> Actualizar([FromBody] ReqActualizarForo req)
        {
            if (req == null)
            {
                return BadRequest(new ResCrearActualizarForo
                {
                    Resultado = false,
                    ListaDeErrores = new List<string> { "Request nulo" }
                });
            }

            var result = await _logica.ActualizarForoAsync(req);
            if (!result.Resultado)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Obtiene todos los foros.
        /// </summary>
        /// <returns>Lista de foros.</returns>
        [HttpPost("obtenerForos")]
        [Authorize]
        public async Task<ActionResult<ResObtenerForosPorRol>> Obtener([FromBody] ReqObtenerForosPorRol req)
        {
            var result = await _logica.ObtenerForosPorRolAsync(req);
            if (!result.Resultado)
                return BadRequest(result);

            return Ok(result);
        }


        /// <summary>
        /// Elimina un foro por su ID.
        /// </summary>
        /// <param name="req">ID del foro a eliminar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpDelete("eliminarForo")]
        public async Task<ActionResult<ResEliminarForo>> Eliminar([FromBody] ReqEliminarForo req)
        {
            if (req == null)
            {
                return BadRequest(new ResEliminarForo
                {
                    Resultado = false,
                    ListaDeErrores = new List<string> { "Request nulo" }
                });
            }

            var result = await _logica.EliminarForoAsync(req);
            if (!result.Resultado)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
