using API.Models.Request;
using API.Models.Response;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Authorize(Roles = "Administrador")]
[Route("api/[controller]")]
public class ClasesController : ControllerBase
{
    private readonly LogicaClases _logica;
    private readonly ILogger<ClasesController> _logger;

    public ClasesController(LogicaClases logica, ILogger<ClasesController> logger)
    {
        _logica = logica;
        _logger = logger;
    }
    
    [HttpGet("obtenerClasesActivas")]
    public async Task<ActionResult<List<ResClase>>> ObtenerClasesActivas()
    {
        var resultado = await _logica.ObtenerClasesPorEstadoAsync(true);
        return Ok(resultado);
    }
    
    [HttpGet("obtenerClasesDesactivadas")]
    public async Task<ActionResult<List<ResClase>>> ObtenerClasesDesactivadas()
    {
        var resultado = await _logica.ObtenerClasesPorEstadoAsync(false);
        return Ok(resultado);
    }
    
    [HttpPost("registrarClase")]
    public async Task<ActionResult<ResBase>> RegistrarClase([FromBody] ReqRegistrarClase req)
    {
        if (req is null) return BadRequest("Datos requeridos.");

        var resultado = await _logica.RegistrarClaseAsync(req);
        if (!resultado.Resultado) return BadRequest(resultado);

        return Ok(resultado);
    }
    
    [HttpPut("actualizarClase")]
    public async Task<ActionResult<ResBase>> ActualizarClase([FromBody] ReqActualizarClase req)
    {
        _logger.LogInformation("ActualizarClase Started : {}",req.Id);
        if (req is null) return BadRequest("Datos requeridos.");

        var resultado = await _logica.ActualizarClaseAsync(req);
        if (!resultado.Resultado) return NotFound(resultado);

        return Ok(resultado);
        
    }
    
    [HttpPut("desactivarClase/{id:int}")]
    public async Task<ActionResult<ResBase>> DesactivarClase(int id)
    {
        _logger.LogInformation("DesactivarClase Started : {}",id);
        var resultado = await _logica.CambiarEstadoClaseAsync(id, false);
        if (!resultado.Resultado) return NotFound(resultado);

        return Ok("Clase desactivada correctamente.");
    }
    
    [HttpPut("activarClase/{id:int}")]
    public async Task<ActionResult<ResBase>> ActivarClase(int id)
    {
        var resultado = await _logica.CambiarEstadoClaseAsync(id, true);
        if (!resultado.Resultado) return NotFound(resultado);

        return Ok("Clase activada correctamente.");
    }
}
