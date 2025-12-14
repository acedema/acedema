using Microsoft.AspNetCore.Mvc;
using API.Models.Request;
using API.Models.Response;
using API.Services;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using API.Utils;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class PersonaController : ControllerBase
    {
        private readonly LogicaUtilitarios _logicaUtilitarios;
        private readonly LogicaPersona _logica;
        private readonly IConfiguration _configuration;     
        private readonly JwtTokenHelper _jwtHelper;
        private readonly ILogger<PersonaController> _logger;

        public PersonaController(LogicaPersona logica, LogicaUtilitarios logicaUtilitarios, IConfiguration configuration, JwtTokenHelper jwtHelper, ILogger<PersonaController> logger)
        {
            _configuration = configuration;
            _logica = logica;
            _logicaUtilitarios = logicaUtilitarios;
            _jwtHelper = jwtHelper;
            _logger = logger;
        }


        /// <summary>
        /// Obtiene los datos de una persona a partir del ID proporcionado.
        /// </summary>
        /// <param name="personaId"></param>
        /// <returns>Respuesta con los datos de la persona o los errores ocurridos.</returns>
        [Authorize(Roles = "Administrador")]
        [HttpGet("obtenerPersona/{personaId:int}")]
        public async Task<ActionResult<ResOptenerPersona>> ObtenerPersona([FromRoute] int personaId)
        {
            var result = await _logica.ObtenerPersona(personaId);

            if (!result.Resultado) return NotFound(result);

            return Ok(result);
        }

        [HttpGet("obtenerMiPerfil")]
        public async Task<ActionResult<ResOptenerPersona>> ObtenerMiPerfil()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email)) return Unauthorized();
            
            if (!Validator.IsValidEmail(email)) return BadRequest("Correo invalido");

            var resultado = await _logica.ObtenerPersonaPorCorreoAsync(email);

            if (!resultado.Resultado) return NotFound(resultado);

            return Ok(resultado);
        }
        
        /// <summary>
        /// Obtiene las personas que pertenecen a un rol determinado.
        /// </summary>
        /// <param name="roleName"></param>
        /// <example>localhost:5000/api/personas?roleName=Estudiante</example>
        /// <returns>A list of all the personas with that role</returns>

        [HttpGet("personas")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<ResOptenerPersona>> GetPersonasByRole([FromQuery] string roleName)
        {
            if (string.IsNullOrEmpty(roleName)) return BadRequest();

            var result = await _logica.GetPersonas(roleName);
            
            if (!result.Resultado) return BadRequest(result);
            return Ok(result);
        }


        /// <summary>
        /// Registra una nueva persona en el sistema. El administrador es quien crea la cuenta.
        /// </summary>
        /// <param name="req">Datos de la persona a registrar.</param>
        /// <returns>Resultado del registro incluyendo errores o el ID generado.</returns>
        [Authorize(Roles = "Administrador")]
        [HttpPost("registrarPersona")]
        public async Task<ActionResult<ResRegistrarPersona>> RegistrarPersona([FromBody] ReqRegistrarPersona? req)
        {
            if (req is null) return BadRequest();

            var result = await _logica.RegistrarPersonaAsync(req);
            
            if (!result.Resultado) return BadRequest(result);
            return Ok(result);
        }

        /// <summary>
        /// Permite a un usuario actualizar su contraseña una vez iniciada sesión con la temporal.
        /// </summary>
        /// <param name="req">Correo, contraseña actual (temporal) y nueva contraseña.</param>
        /// <returns>Resultado del proceso de actualización de la contraseña.</returns>
        [HttpPost("actualizarContrasena")]
        public async Task<ActionResult<ResRestablecerContrasena>> ActualizarContrasena([FromBody] ReqRestablecerContrasena? req)
        {
            if (req == null) return BadRequest();
            
            if (!Validator.IsValidEmail(req.Correo)) return BadRequest("Correo invalido");

            var res = await _logica.ActualizarContrasenaAsync(req);
            if(res.Resultado) return Ok(res);
            return Unauthorized(res);
        }
        
        /// Permite a un usuario cambiar la clave inicial sin token
        [AllowAnonymous]
        [HttpPost("cambiar-clave-inicial")]
        public async Task<ActionResult<ResRestablecerContrasena>> CambiarClaveInicial([FromBody] ReqRestablecerContrasena? req)
        {
            if (req == null) return BadRequest();
            if (!Validator.IsValidEmail(req.Correo)) return BadRequest("Correo invalido");

            var res = await _logica.ActualizarContrasenaAsync(req);

            if (res.Resultado) return Ok(res);
            return Unauthorized(res);
        }


        /// <summary>
        /// Solicita la recuperación de contraseña para un correo registrado.
        /// </summary>
        /// <param name="req">Objeto que contiene el correo del usuario.</param>
        /// <returns>
        /// - 200 OK si se envió correctamente el correo con el enlace de recuperación.  
        /// - 400 BadRequest si el correo es nulo o vacío.  
        /// - 404 NotFound si el correo no está registrado.  
        /// - 500 InternalServerError si ocurrió un error durante la verificación o el envío del correo.
        /// </returns>
        [AllowAnonymous]
        [HttpPost("solicitar-recuperacion")]
        public async Task<IActionResult> SolicitarRecuperacion([FromBody] ReqCorreo req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.Correo))
                return BadRequest("El correo es obligatorio.");

            var resExiste = await _logica.ObtenerPersonaPorCorreoAsync(req.Correo);

            if (!resExiste.Resultado)
            {
                return BadRequest("Correo no esta registrado.");
            }

            var token = _jwtHelper.GenerarTokenRestablecer(req.Correo);

            var urlRecuperacion = $"https://tusitio.com/restablecer?token={token}";

            bool emailEnviado = await _logicaUtilitarios.EnviarCorreoRecuperacionAsync(req.Correo, urlRecuperacion);

            if (!emailEnviado)
                return StatusCode(500, "Error enviando el correo de recuperación.");

            return Ok("Se ha enviado un enlace para restablecer su contraseña.");
        }


        /// <summary>
        /// Restablece la contraseña de un usuario utilizando un token JWT de recuperación.
        /// </summary>
        /// <param name="req">Objeto que contiene la nueva contraseña.</param>
        /// <returns>
        /// - 200 OK si la contraseña se actualizó correctamente.  
        /// - 400 BadRequest si faltan datos, el token es inválido o la contraseña es muy corta.  
        /// - 500 InternalServerError si ocurre un error al actualizar la contraseña.
        /// </returns>
        // [HttpPost("restablecer-con-token")]
        // public async Task<IActionResult> RestablecerConToken ([FromBody] ReqRestablecerConToken? req)
        // {
        //     if (req?.NuevaContrasena is null) return BadRequest();
        //     
        //     var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        //     
        //     _logger.LogDebug("Email en token :: {}", email);
        //     
        //     if(email is null || !Validator.IsValidEmail(email)) return Unauthorized();
        //
        //     var res = await _logica.ActualizarContrasenaPorCorreo(email, req.NuevaContrasena);
        //     
        //     if(!res.Resultado) return Unauthorized(res);
        //     return Ok(res);
        // }


        /// <summary>
        /// Autentica a un usuario con correo y contraseña, y devuelve un token JWT si es válido.
        /// </summary>
        /// <param name="req">Objeto que contiene las credenciales del usuario (correo y contraseña).</param>
        /// <returns>
        /// Respuesta HTTP:
        /// - 200 OK con un objeto que incluye el token JWT y datos básicos del usuario en caso de éxito.
        /// - 401 Unauthorized si las credenciales son incorrectas.
        /// - 400 BadRequest si el request es nulo o inválido.
        /// </returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] ReqLoginPersona req)
        {
            // 1. Validar que el request no sea nulo y que los campos no estén vacíos
            if (req == null || string.IsNullOrWhiteSpace(req.Correo) || string.IsNullOrWhiteSpace(req.Contrasena))
            {
                return BadRequest(new { message = "El correo y la contraseña son obligatorios." });
            }

            // 2. Llamar a la lógica para validar las credenciales mediante procedimiento almacenado
            var resLogin = await _logica.ValidarLoginAsync(req);

            // 3. Si la validación falla, responder con 401 Unauthorized y mensaje
            if (!resLogin.Resultado)
                return Unauthorized(new { message = resLogin.Mensaje });

            // Usar el nombre del rol directamente desde la base de datos
            var rol = resLogin.Persona.NombreRol;

            // Generar token con correo y rol real
            var token = _jwtHelper.GenerarTokenLogin(resLogin.Persona.Correo, rol);
            
            // Devolver respuesta 200 OK con el token y los datos relevantes del usuario
            return Ok(new
            {
                token,
                usuario = new
                {
                    resLogin.Persona.PersonaId,
                    resLogin.Persona.PrimerNombre,
                    resLogin.Persona.SegundoNombre,
                    resLogin.Persona.PrimerApellido,
                    resLogin.Persona.SegundoApellido,
                    resLogin.Persona.Correo,
                    resLogin.Persona.IdRol,
                    resLogin.Persona.Puesto

                }
            });
        }

        /// <summary>
        /// Endpoint para que un usuario autorizado actualice su perfil personal.
        /// Valida que el correo en el token coincida con el correo del request para evitar modificaciones no autorizadas.
        /// </summary>
        /// <param name="req">Datos del perfil a actualizar</param>
        /// <returns>Resultado de la operación</returns>
        [HttpPut("actualizarMiPerfil")]
        public async Task<IActionResult> ActualizarMiPerfil([FromBody] ReqActualizarPerfil? req)
        {
            if (req is null) return BadRequest();
            
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            
            _logger.LogDebug("Email en token :: {}", email);
            
            if(email is null || !Validator.IsValidEmail(email)) return Unauthorized();

            var resultado = await _logica.ActualizarPerfilAsync(email, req);

            if (!resultado.Resultado) return BadRequest(resultado);

            return Ok("Perfil actualizado correctamente.");
        }


    }
}

