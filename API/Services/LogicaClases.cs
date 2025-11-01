using API.Models.Request;
using API.Models.Response;
using Dapper;
using Npgsql;
using System.Data;

namespace API.Services
{
    public class LogicaClases
    {
        private readonly ILogger<LogicaClases> _logger;
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        public LogicaClases(IConfiguration configuration, ILogger<LogicaClases> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        
        public async Task<ResBase> RegistrarClaseAsync(ReqRegistrarClase req)
        {
            _logger.LogDebug("Inicio registro de clase :: {}", req.NombreClase);
            var res = new ResBase();

            const string sql = @"
                INSERT INTO clases (nombre_clase, modalidad, descripcion, imagen, estado)
                VALUES (@NombreClase, @Modalidad, @Descripcion, @Imagen, true);";

            try
            {
                using var conn = new NpgsqlConnection(_connectionString);
                var result = await conn.ExecuteAsync(sql, new
                {
                    NombreClase = req.NombreClase,
                    Modalidad = req.Modalidad,
                    Descripcion = req.Descripcion,
                    Imagen = req.Imagen
                });

                res.Resultado = result > 0;
                res.Mensaje = result > 0 ? "Clase registrada correctamente." : "No se pudo registrar la clase.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al registrar clase.");
                res.Resultado = false;
                res.Mensaje = "Error inesperado al registrar la clase.";
                res.ListaDeErrores.Add(ex.Message);
            }

            _logger.LogDebug("Registro de clase finalizado :: {}", req.NombreClase);
            return res;
        }
        
        public async Task<ResBase> ActualizarClaseAsync(ReqActualizarClase req)
        {
            _logger.LogDebug("Inicio actualización de clase :: {}", req.Id);
            var res = new ResBase();

            const string sql = @"
                UPDATE clases SET
                    nombre_clase = @NombreClase,
                    modalidad = @Modalidad,
                    descripcion = @Descripcion,
                    imagen = @Imagen
                WHERE id_clase = @IdClase;";

            try
            {
                using var conn = new NpgsqlConnection(_connectionString);
                var result = await conn.ExecuteAsync(sql, new
                {
                    IdClase = req.Id,
                    NombreClase = req.NombreClase,
                    Modalidad = req.Modalidad,
                    Descripcion = req.Descripcion,
                    Imagen = req.Imagen
                });

                res.Resultado = result > 0;
                res.Mensaje = result > 0 ? "Clase actualizada correctamente." : "Clase no encontrada o sin cambios.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar clase.");
                res.Resultado = false;
                res.Mensaje = "Error inesperado al actualizar la clase.";
                res.ListaDeErrores.Add(ex.Message);
            }

            _logger.LogDebug("Actualización de clase finalizada :: {}", req.Id);
            return res;
        }
        public async Task<ResBase> CambiarEstadoClaseAsync(int id, bool estado)
        {
            _logger.LogDebug("Cambio de estado para clase :: {} a {}", id, estado);
            var res = new ResBase();

            const string sql = @"UPDATE clases SET estado = @Estado WHERE id_clase = @IdClase;";

            try
            {
                using var conn = new NpgsqlConnection(_connectionString);
                var result = await conn.ExecuteAsync(sql, new { IdClase = id, Estado = estado });

                res.Resultado = result > 0;
                res.Mensaje = result > 0
                    ? (estado ? "Clase activada correctamente." : "Clase desactivada correctamente.")
                    : "Clase no encontrada.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cambiar estado de clase.");
                res.Resultado = false;
                res.Mensaje = "Error inesperado al cambiar el estado.";
                res.ListaDeErrores.Add(ex.Message);
            }

            _logger.LogDebug("Cambio de estado finalizado :: {}", id);
            return res;
        }

        public async Task<List<ResClase>> ObtenerClasesPorEstadoAsync(bool estado)
        {
            _logger.LogDebug("Consulta de clases por estado :: {}", estado);
            var lista = new List<ResClase>();

            const string sql = @"
                        SELECT id_clase AS IdClase,
                               nombre_clase AS NombreClase,
                               modalidad AS Modalidad,
                               descripcion AS Descripcion, 
                               imagen AS Imagen,
                               estado AS Estado
                        FROM clases
                        WHERE estado = @Estado;";

            try
            {
                using var conn = new NpgsqlConnection(_connectionString);
                var result = await conn.QueryAsync<ResClase>(sql, new { Estado = estado });
                lista = result.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener clases por estado.");
            }

            _logger.LogDebug("Consulta de clases finalizada :: {}", estado);
            return lista;
        }
    }
}