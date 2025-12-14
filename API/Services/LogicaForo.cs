using API.Models.Entities;
using API.Models.Request;
using API.Models.Response;
using Microsoft.Data.SqlClient;
using System.Data;
using Dapper;
using Npgsql;

namespace API.Services
{
    /// <summary>
    /// Lógica de negocio relacionada con el manejo de publicaciones del foro.
    /// </summary>
    public class LogicaForo
    {
        private readonly string _connectionString;

        /// <summary>
        /// Constructor que recibe la configuración para extraer la cadena de conexión.
        /// </summary>
        public LogicaForo(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        /// <summary>
        /// Crea un nuevo foro y asigna los roles correspondientes.
        /// </summary>
        /// <param name="req">Datos para crear el foro, incluyendo roles asignados.</param>
        /// <returns>Respuesta con resultado de la operación y el ID del foro creado.</returns>
        public async Task<ResCrearActualizarForo> CrearForoAsync(ReqCrearForo req)
        {
            var res = new ResCrearActualizarForo();

            try
            {
                using var conn = new NpgsqlConnection(_connectionString);
                await conn.OpenAsync();
                
                const string sqlForo = @"
            INSERT INTO foro (id_administrador, titulo, descripcion, fecha_registro, espublico, fechaultimamodificacion)
            VALUES (@AdminId, @Titulo, @Descripcion, @FechaRegistro, @EsPublico, NOW())
            RETURNING id_foro;
        ";

                var idForo = await conn.ExecuteScalarAsync<int>(sqlForo, new
                {
                    req.AdminId,
                    req.Titulo,
                    req.Descripcion,
                    req.FechaRegistro,
                    EsPublico = req.EsPublico 
                });

                res.Resultado = true;
                res.Mensaje = "Foro creado correctamente.";
                res.ForoId = idForo;
                
                if (!req.EsPublico && req.RolesAsignados != null && req.RolesAsignados.Count > 0)
                {
                    const string sqlRol = @"
                INSERT INTO foro_roles (id_foro, id_rol)
                VALUES (@IdForo, @IdRol);
            ";

                    foreach (var rolId in req.RolesAsignados)
                    {
                        await conn.ExecuteAsync(sqlRol, new { IdForo = idForo, IdRol = rolId });
                    }
                }
            }
            catch (Exception ex)
            {
                res.Resultado = false;
                res.Mensaje = $"Error al crear foro: {ex.Message}";
                res.ListaDeErrores.Add(ex.Message);
            }

            return res;
        }


        /// <summary>
        /// Actualiza un foro y sus roles asignados.
        /// </summary>
        /// <param name="req">Datos para actualizar el foro, incluyendo roles.</param>
        /// <returns>Resultado con mensaje y estado.</returns>
        public async Task<ResCrearActualizarForo> ActualizarForoAsync(ReqActualizarForo req)
{
    var res = new ResCrearActualizarForo
    {
        ListaDeErrores = new List<string>()
    };

    using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    using var transaction = await conn.BeginTransactionAsync();

    try
    {
        const string sqlUpdateForo = @"
            UPDATE foro
            SET id_administrador = @AdminId,
                titulo = @Titulo,
                descripcion = @Descripcion,
                espublico = @EsPublico,
                fechaultimamodificacion = NOW()
            WHERE id_foro = @ForoId;
        ";

        var rowsAffected = await conn.ExecuteAsync(sqlUpdateForo, new
        {
            req.AdminId,
            req.Titulo,
            req.Descripcion,
            req.EsPublico,
            req.ForoId
        }, transaction);

        if (rowsAffected == 0)
        {
            res.Resultado = false;
            res.Mensaje = "No se encontró el foro a actualizar.";
            await transaction.RollbackAsync();
            return res;
        }


        if (!req.EsPublico)
        {
            const string sqlDeleteRoles = @"DELETE FROM foro_roles WHERE id_foro = @IdForo;";
            await conn.ExecuteAsync(sqlDeleteRoles, new { IdForo = req.ForoId }, transaction);
            
            if (req.RolesAsignados != null && req.RolesAsignados.Count > 0)
            {
                const string sqlInsertRol = @"INSERT INTO foro_roles (id_foro, id_rol) VALUES (@IdForo, @IdRol);";

                foreach (var rolId in req.RolesAsignados)
                {
                    await conn.ExecuteAsync(sqlInsertRol, new { IdForo = req.ForoId, IdRol = rolId }, transaction);
                }
            }
        }
        else
        {
            const string sqlDeleteRoles = @"DELETE FROM foro_roles WHERE id_foro = @IdForo;";
            await conn.ExecuteAsync(sqlDeleteRoles, new { IdForo = req.ForoId }, transaction);
        }

        await transaction.CommitAsync();

        res.Resultado = true;
        res.Mensaje = "Foro actualizado correctamente.";
        res.ForoId = req.ForoId;
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        res.Resultado = false;
        res.Mensaje = $"Error al actualizar foro: {ex.Message}";
        res.ListaDeErrores.Add(ex.Message);
    }

    return res;
}

        public async Task<ResObtenerForosPorRol> ObtenerForosPorRolAsync(ReqObtenerForosPorRol req)
        {
            var res = new ResObtenerForosPorRol
            {
                Foros = new List<Foro>(),
                ListaDeErrores = new List<string>()
            };

            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            try
            {
                const string sql = @"
            SELECT f.id_foro,
                   f.id_administrador,
                   f.titulo,
                   f.descripcion,
                   f.fecha_registro,
                   f.fechaultimamodificacion,
                   f.espublico
            FROM foro f
            LEFT JOIN foro_roles fr ON f.id_foro = fr.id_foro
            WHERE f.espublico = TRUE OR fr.id_rol = @RolId;
        ";

                var foros = await conn.QueryAsync<Foro>(sql, new { RolId = req.RolId });

                res.Foros = foros.ToList();
                res.Resultado = true;
                res.Mensaje = "Foros obtenidos correctamente.";
            }
            catch (Exception ex)
            {
                res.Resultado = false;
                res.Mensaje = $"Error al obtener foros: {ex.Message}";
                res.ListaDeErrores.Add(ex.Message);
            }

            return res;
        }

        public async Task<ResEliminarForo> EliminarForoAsync(ReqEliminarForo req)
{
    var res = new ResEliminarForo
    {
        ListaDeErrores = new List<string>()
    };

    using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    using var transaction = await conn.BeginTransactionAsync();

    try
    {
        const string sqlCheck = @"
            SELECT COUNT(*) 
            FROM foro 
            WHERE id_foro = @ForoId AND id_administrador = @AdminId;
        ";

        var exists = await conn.ExecuteScalarAsync<int>(sqlCheck, new
        {
            req.ForoId,
            req.AdminId
        }, transaction);

        if (exists == 0)
        {
            res.Resultado = false;
            res.Mensaje = "No se encontró el foro o no pertenece al administrador.";
            await transaction.RollbackAsync();
            return res;
        }
        
        const string sqlDeleteRoles = @"DELETE FROM foro_roles WHERE id_foro = @ForoId;";
        await conn.ExecuteAsync(sqlDeleteRoles, new { req.ForoId }, transaction);
        
        const string sqlDeleteForo = @"DELETE FROM foro WHERE id_foro = @ForoId;";
        var rowsAffected = await conn.ExecuteAsync(sqlDeleteForo, new { req.ForoId }, transaction);

        if (rowsAffected == 0)
        {
            res.Resultado = false;
            res.Mensaje = "No se pudo eliminar el foro.";
            await transaction.RollbackAsync();
            return res;
        }

        await transaction.CommitAsync();

        res.Resultado = true;
        res.Mensaje = "Foro eliminado correctamente.";
        
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        res.Resultado = false;
        res.Mensaje = $"Error al eliminar foro: {ex.Message}";
        res.ListaDeErrores.Add(ex.Message);
    }

    return res;
}

    }
}
