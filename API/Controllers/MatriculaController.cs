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
    /// Controlador para gestionar operaciones relacionadas con la matr�cula escolar.
    /// </summary>
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class MatriculaController : ControllerBase
    {
        private readonly LogicaMatricula _logica;

        /// <summary>
        /// Constructor del controlador de matr�cula.
        /// </summary>
        /// <param name="logica">Instancia de la l�gica de negocio para matr�cula.</param>
        public MatriculaController(LogicaMatricula logica)
        {
            _logica = logica;
        }

        /// <summary>
        /// Obtiene la informaci�n de matr�cula de un estudiante seg�n su ID.
        /// </summary>
        /// <param name="req">Objeto con el ID de la persona para buscar matr�cula.</param>
        /// <returns>
        /// - 200 OK con la informaci�n de matr�cula si se encuentra.  
        /// - 400 BadRequest si el request es nulo o hay error en la b�squeda.
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
        /// Realiza el proceso de matr�cula para un estudiante.
        /// </summary>
        /// <param name="req">Objeto con los datos necesarios para matricular al estudiante.</param>
        /// <returns>
        /// - 200 OK con la matr�cula creada si todo sale bien.  
        /// - 400 BadRequest si el request es nulo o la matr�cula falla.
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
