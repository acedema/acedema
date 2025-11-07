using Microsoft.AspNetCore.Mvc;
using API.Models.Request;
using API.Models.Response;
using API.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    /// <summary>
    /// Controlador para gestionar operaciones relacionadas con la matrcula escolar.
    /// </summary>
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class MatriculaController : ControllerBase
    {
        private readonly LogicaMatricula _logica;

        /// <summary>
        /// Constructor del controlador de matrcula.
        /// </summary>
        /// <param name="logica">Instancia de la lgica de negocio para matrcula.</param>

        public MatriculaController(LogicaMatricula logica)
        {
            _logica = logica;
        }

        /// <summary>
        /// Obtiene la informacin de matrcula de un estudiante segn su ID.
        /// </summary>
        /// <param name="req">Objeto con el ID de la persona para buscar matrcula.</param>
        /// <returns>
        /// - 200 OK con la informacin de matrcula si se encuentra.  
        /// - 400 BadRequest si el request es nulo o hay error en la bsqueda.
        /// </returns>
        [HttpPost("obtenerMatricula")]
        public async Task<ActionResult<ResOptenerMatricula>> ObtenerMatricula([FromBody] ReqOptenerMatricula req)
        {
            if (req == null)
            {
                return BadRequest(new ResOptenerMatricula
                {
                    Resultado = false,
                    ListaDeErrores = new List<string> { "Request nulo" }
                });
            }

            var result = await _logica.BuscarMatriculaAsync(req);
            if (!result.Resultado)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Realiza el proceso de matrcula para un estudiante.
        /// </summary>
        /// <param name="req">Objeto con los datos necesarios para matricular al estudiante.</param>
        /// <returns>
        /// - 200 OK con la matrcula creada si todo sale bien.  
        /// - 400 BadRequest si el request es nulo o la matrcula falla.
        /// </returns>
        [HttpPost("realizarMatricula")]
        public async Task<ActionResult<ResMatricular>> RealizarMatricula([FromBody] ReqMatricular req)
        {
            if (req == null)
            {
                return BadRequest(new ResMatricular
                {
                    Resultado = false,
                    ListaDeErrores = new List<string> { "Request nulo" }
                });
            }

            var result = await _logica.MatricularAsync(req);
            if (!result.Resultado)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
