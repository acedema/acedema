using API.Models.Entities;
using API.Models.Request;
using API.Models.Response;
using Npgsql;
using System.Data;
using System.Text;
using Dapper;

namespace API.Services
{
    /// <summary>
    /// Lógica de negocio relacionada con la entidad Persona.
    /// Encapsula interacciones con procedimientos almacenados para registrar, obtener o actualizar datos de personas.
    /// </summary>
    public class LogicaPersona
    {
        private readonly ILogger<LogicaPersona> _logger;
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Constructor que recibe la configuración del sistema.
        /// </summary>
        /// <param name="configuration">Configuración de la aplicación, usada para obtener la cadena de conexión.</param>
        public LogicaPersona(IConfiguration configuration, ILogger<LogicaPersona> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        /// <summary>
        /// Obtiene la información detallada de una persona a partir de su ID.
        /// </summary>
        /// <param name="personaId"></param>
        /// <returns>
        /// Objeto <see cref="ResOptenerPersona"/> que contiene los datos de la persona,
        /// un mensaje de estado, el resultado de la operación y posibles errores.
        /// </returns>
        /// <remarks>
        /// Este método ejecuta el procedimiento almacenado 'TraerInfoUsuario' y procesa
        /// sus parámetros de salida. También maneja excepciones y errores personalizados
        /// definidos en el SP.
        /// </remarks>
        public async Task<ResOptenerPersona> ObtenerPersona(int personaId)
        {
            _logger.LogDebug("Obtener Persona Inicio :: {}", personaId);

            var res = new ResOptenerPersona();
            const string sql = """
                               SELECT 
                               p.id_persona AS PersonaId,
                               p.num_cedula AS NumCedula,
                               p.fecha_nacimiento AS FechaNacimiento,
                               p.primer_nombre AS PrimerNombre,
                               p.segundo_nombre AS SegundoNombre,
                               p.primer_apellido AS PrimerApellido,
                               p.segundo_apellido AS SegundoApellido,
                               p.correo AS Correo,
                               p.direccion AS Direccion,
                               p.telefono_1 AS Telefono1,
                               p.telefono_2 AS Telefono2,
                               p.fecha_registro AS FechaRegistro,
                               p.id_rol AS IdRol,
                               r.nombre AS NombreRol,
                               p.puesto AS Puesto,
                               p.cedula_responsable AS CedulaResponsable 
                               FROM persona p
                               INNER JOIN Roles r ON p.id_Rol = r.id_rol
                               WHERE p.id_persona = @personaId
                               """;

            try
            {
                using (var conn = new NpgsqlConnection(_connectionString))
                {
                    res.Persona = await conn.QueryFirstOrDefaultAsync<Persona>(sql, new { personaId });

                    res.Resultado = true;
                    res.Mensaje = res.Persona != null
                        ? "Persona encontrada correctamente."
                        : "No se encontró ninguna persona.";
                    if (res.Persona != null)
                        _logger.LogDebug("Persona encontrada correctamente con id :: {}", personaId);
                    else _logger.LogError("No se encontró ninguna persona con id :: {}", personaId);
                }
            }

            catch (NpgsqlException ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error de base de datos al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error inesperado al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }

            _logger.LogDebug("Obtener Persona Finalizada :: {}", personaId);
            return res;
        }

        /// <summary>
        /// Obtiene la información completa de una persona a partir de su ID o correo electrónico.
        /// </summary>
        /// <param name="email">Objeto <see cref="ReqObtenerPersona"/> con el ID y/o correo a consultar.</param>
        /// <returns>
        /// Objeto <see cref="ResOptenerPersona"/> con la información de la persona, si fue encontrada,
        /// junto con el estado de la operación y errores si existieran.
        /// </returns>
        public async Task<ResOptenerPersona> ObtenerPersonaPorCorreoAsync(string email)
        {
            _logger.LogDebug("Obtener Persona Por Correo Inicio :: {}", email);

            var res = new ResOptenerPersona();
            const string sql = """
                               SELECT 
                               p.id_persona AS PersonaId,
                               p.num_cedula AS NumCedula,
                               p.fecha_nacimiento AS FechaNacimiento,
                               p.primer_nombre AS PrimerNombre,
                               p.segundo_nombre AS SegundoNombre,
                               p.primer_apellido AS PrimerApellido,
                               p.segundo_apellido AS SegundoApellido,
                               p.correo AS Correo,
                               p.direccion AS Direccion,
                               p.telefono_1 AS Telefono1,
                               p.telefono_2 AS Telefono2,
                               p.fecha_registro AS FechaRegistro,
                               p.id_rol AS IdRol,
                               r.nombre AS NombreRol,
                               p.puesto AS Puesto,
                               p.cedula_responsable AS CedulaResponsable 
                               FROM persona p
                               INNER JOIN Roles r ON p.id_Rol = r.id_rol
                               WHERE correo = @email
                               """;

            try
            {
                using (var conn = new NpgsqlConnection(_connectionString))
                {
                    res.Persona = await conn.QueryFirstOrDefaultAsync<Persona>(sql, new { email });

                    res.Resultado = true;
                    res.Mensaje = res.Persona != null
                        ? "Persona encontrada correctamente."
                        : "No se encontró ninguna persona.";
                    if (res.Persona != null)
                        _logger.LogDebug("Persona encontrada correctamente con email :: {}", email);
                    else _logger.LogError("No se encontró ninguna persona con email :: {}", email);
                }
            }
            catch (NpgsqlException ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error de base de datos al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error inesperado al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }

            _logger.LogDebug("Obtener Persona Por Correo Final :: {}", email);
            return res;
        }
        
        

        /// <summary>
        /// Obtiene la información completa de una persona a partir de su ID o correo electrónico.
        /// </summary>
        /// <param name="roleName">Objeto <see cref="ReqObtenerPersona"/> con el ID y/o correo a consultar.</param>
        /// <returns>
        /// Objeto <see cref="ResOptenerPersona"/> con la información de la persona, si fue encontrada,
        /// junto con el estado de la operación y errores si existieran.
        /// </returns>
        public async Task<ResPersonas> GetPersonas(string roleName)
        {
            _logger.LogDebug("Get Personas RoleName :: {}", roleName);

            var res = new ResPersonas();
            const string sql = """
                               SELECT 
                               p.id_persona AS PersonaId,
                               p.num_cedula AS NumCedula,
                               p.fecha_nacimiento AS FechaNacimiento,
                               p.primer_nombre AS PrimerNombre,
                               p.segundo_nombre AS SegundoNombre,
                               p.primer_apellido AS PrimerApellido,
                               p.segundo_apellido AS SegundoApellido,
                               p.correo AS Correo,
                               p.direccion AS Direccion,
                               p.telefono_1 AS Telefono1,
                               p.telefono_2 AS Telefono2,
                               p.fecha_registro AS FechaRegistro,
                               p.id_rol AS IdRol,
                               r.nombre AS NombreRol,
                               p.puesto AS Puesto,
                               p.cedula_responsable AS CedulaResponsable 
                               FROM persona p
                               INNER JOIN Roles r ON p.id_Rol = r.id_rol
                               WHERE r.nombre = @roleName
                               """;

            try
            {
                using (var conn = new NpgsqlConnection(_connectionString))
                {
                    var personas = await conn.QueryAsync<Persona>(sql, new { rolename = roleName });
                    res.Personas = personas.ToList();

                    res.Resultado = true;
                    res.Mensaje = res.Personas != null
                        ? "Personas."
                        : "No se encontró ninguna persona.";
                    if (res.Personas != null)
                        _logger.LogDebug("Personas encontrada correctamente RoleName :: {}", roleName);
                    else _logger.LogError("No se encontró ninguna persona RoleName :: {}", roleName);
                }
            }
            catch (NpgsqlException ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error de base de datos al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error inesperado al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }

            _logger.LogDebug("Obtener PersonaRoleName :: {}", roleName);
            return res;
        }


        /// <summary>
        /// Registra una nueva persona en la base de datos. También se envía una contraseña temporal por correo.
        /// </summary>
        /// <param name="req">Datos de la persona a registrar.</param>
        /// <returns>Resultado del registro, incluyendo el ID de la nueva persona y errores si los hubiera.</returns>
        public async Task<ResRegistrarPersona> RegistrarPersonaAsync(ReqRegistrarPersona req)
        {
            var res = new ResRegistrarPersona();
            var utilitarios = new LogicaUtilitarios(_configuration);

            try
            {
                var error = LogicaUtilitarios.ValidarPersona(req);
                if (error != null)
                {
                    res.Resultado = false;
                    res.Mensaje = error;
                    return res;
                }

                string passwordPlano = utilitarios.GenerarPassword(12);
                string passwordHash = utilitarios.Encriptar(passwordPlano);

                using var conn = new NpgsqlConnection(_connectionString);
                using var cmd = new NpgsqlCommand(@"
                SELECT * FROM registrar_persona(
                    @num_cedula,
                    @fecha_nacimiento,
                    @primer_nombre,
                    @segundo_nombre,
                    @primer_apellido,
                    @segundo_apellido,
                    @correo,
                    @contraseña,
                    @direccion,
                    @telefono_1,
                    @telefono_2,
                    @id_rol,
                    @puesto,
                    @cedula_responsable
                );", conn);

                cmd.CommandType = CommandType.Text;

                // Parámetros
                cmd.Parameters.AddWithValue("num_cedula", req.Persona.NumCedula);
                cmd.Parameters.AddWithValue("fecha_nacimiento", req.Persona.FechaNacimiento);
                cmd.Parameters.AddWithValue("primer_nombre", req.Persona.PrimerNombre);
                cmd.Parameters.AddWithValue("segundo_nombre", (object?)req.Persona.SegundoNombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("primer_apellido", req.Persona.PrimerApellido);
                cmd.Parameters.AddWithValue("segundo_apellido", (object?)req.Persona.SegundoApellido ?? DBNull.Value);
                cmd.Parameters.AddWithValue("correo", req.Persona.Correo);
                cmd.Parameters.AddWithValue("contraseña", passwordHash);
                cmd.Parameters.AddWithValue("direccion", req.Persona.Direccion);
                cmd.Parameters.AddWithValue("telefono_1", req.Persona.Telefono1);
                cmd.Parameters.AddWithValue("telefono_2", req.Persona.Telefono2);
                cmd.Parameters.AddWithValue("id_rol", req.Persona.IdRol);
                cmd.Parameters.AddWithValue("puesto", req.Persona.Puesto);
                cmd.Parameters.AddWithValue("cedula_responsable",
                    (object?)req.Persona.CedulaResponsable ?? DBNull.Value);

                await conn.OpenAsync();

                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    int errorCode = reader.GetInt32(reader.GetOrdinal("erroroccurred"));
                    string mensajeSP = reader.GetString(reader.GetOrdinal("errormensaje"));
                    int? idReturn = reader.IsDBNull(reader.GetOrdinal("idReturn"))
                        ? null
                        : reader.GetInt32(reader.GetOrdinal("idReturn"));

                    if (errorCode != 0 || idReturn == null)
                    {
                        res.Resultado = false;
                        res.Mensaje = $"Error en SP: {mensajeSP}";
                        return res;
                    }

                    res.Resultado = true;
                    res.Mensaje = "Persona registrada correctamente.";
                    res.Password = passwordPlano;
                    res.Persona = req.Persona;
                    res.Persona.PersonaId = idReturn.Value;
                    res.PasswordTemporal = passwordPlano;
                }
                else
                {
                    res.Resultado = false;
                    res.Mensaje = "No se obtuvo respuesta del procedimiento.";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + "|" + ex.StackTrace);
                res.Resultado = false;
                res.Mensaje = "Error inesperado al registrar persona.";
                res.ListaDeErrores.Add(ex.Message);
            }

            return res;
        }

        /// <summary>
        /// Actualiza la contraseña de un usuario autenticado que ingresó con la temporal.
        /// </summary>
        /// <param name="req">Contiene el correo, la contraseña actual y la nueva contraseña.</param>
        /// <returns>Resultado de la operación incluyendo errores si los hay.</returns>
        public async Task<ResRestablecerContrasena> ActualizarContrasenaAsync(ReqRestablecerContrasena req)
        {
            _logger.LogDebug("Contrasena Actualizar Inicio :: {}", req.Correo);

            var res = new ResRestablecerContrasena();
            var utilitarios = new LogicaUtilitarios(_configuration);

            const string sql = """
                               UPDATE Persona
                               SET contraseña = @newPassE
                               WHERE correo = @Correo
                               AND contraseña = @oldPassE
                               """;

            try
            {
                var oldPassE = utilitarios.Encriptar(req.ContrasenaActual);
                var newPassE = utilitarios.Encriptar(req.NuevaContrasena);


                using (var conn = new NpgsqlConnection(_connectionString))
                {
                    var rowsAffected = await conn.ExecuteAsync(sql, new { newPassE, req.Correo, oldPassE });


                    if (rowsAffected != 1)
                    {
                        res.Resultado = false;
                        res.Mensaje = "Error: El correo o la contraseña actual no son correctos.";
                        _logger.LogInformation("Fallo al actualizar contraseña para correo :: {}. 0 filas afectadas.",
                            req.Correo);
                    }
                    else
                    {
                        res.Resultado = true;
                        res.Mensaje = "Contraseña actualizada correctamente.";
                        _logger.LogDebug("Contraseña actualizada para correo :: {}", req.Correo);
                    }
                }
            }
            catch (NpgsqlException ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error de base de datos al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error inesperado al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }

            _logger.LogDebug("Contrasena Actualizar Final :: {}", req.Correo);

            return res;
        }

        /// <summary>
        /// Actualiza la contraseña de una persona utilizando su correo electrónico.
        /// </summary>
        /// <param name="email">Correo electrónico de la persona.</param>
        /// <param name="newPassWord">Nueva contraseña en formato hash.</param>
        /// <returns>
        /// Objeto <see cref="ResActualizarContrasena"/> con el resultado de la operación,
        /// incluyendo si fue exitosa y mensajes de error si aplica.
        /// </returns>
        public async Task<ResRestablecerContrasena> ActualizarContrasenaPorCorreo(string email, string newPassWord)
        {
            _logger.LogDebug("Contrasena Actualizar Inicio :: {}", email);

            var res = new ResRestablecerContrasena();
            var utilitarios = new LogicaUtilitarios(_configuration);

            const string sql = """
                               UPDATE Persona
                               SET contraseña = @newPassE
                               WHERE correo = @email
                               """;

            try
            {
                var newPassE = utilitarios.Encriptar(newPassWord);


                using (var conn = new NpgsqlConnection(_connectionString))
                {
                    var rowsAffected = await conn.ExecuteAsync(sql, new { newPassE, email });


                    if (rowsAffected != 1)
                    {
                        res.Resultado = false;
                        res.Mensaje = "Error: El correo o la contraseña actual no son correctos.";
                        _logger.LogInformation("Fallo al actualizar contraseña para correo :: {}. 0 filas afectadas.",
                            email);
                    }
                    else
                    {
                        res.Resultado = true;
                        res.Mensaje = "Contraseña actualizada correctamente.";
                        _logger.LogDebug("Contraseña actualizada para correo :: {}", email);
                    }
                }
            }
            catch (NpgsqlException ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error de base de datos al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                res.Resultado = false;
                res.Mensaje = "Error inesperado al obtener la persona.";
                res.ListaDeErrores.Add(ex.Message);
            }

            _logger.LogDebug("Contrasena Actualizar Final :: {}", email);

            return res;
        }

        /// <summary>
        /// Válida las credenciales de inicio de sesión de una persona.
        /// </summary>
        /// <param name="req">Objeto <see cref="ReqLoginPersona"/> que contiene el correo y la contraseña en texto plano.</param>
        /// <returns>
        /// Objeto <see cref="ResLoginPersona"/> con los datos de la persona si el login es exitoso,
        /// además de los mensajes y errores correspondientes.
        /// </returns>
        public async Task<ResLoginPersona> ValidarLoginAsync(ReqLoginPersona req)
        {
            var res = new ResLoginPersona();
            var utilitarios = new LogicaUtilitarios(_configuration);

            try
            {
                // Changed to NpgsqlConnection and NpgsqlCommand
                using var conn = new NpgsqlConnection(_connectionString);
                using var cmd = new NpgsqlCommand("SELECT * FROM login_persona(@p_email, @p_password)", conn);
                cmd.CommandType = CommandType.Text;

                // Encriptar la contraseña antes de enviarla
                string passEncriptada = utilitarios.Encriptar(req.Contrasena);

                // Parámetros de entrada
                cmd.Parameters.AddWithValue("p_email", NpgsqlTypes.NpgsqlDbType.Varchar, req.Correo);
                cmd.Parameters.AddWithValue("p_password", NpgsqlTypes.NpgsqlDbType.Varchar, passEncriptada);

                // Parámetros de salida de MSSQL han sido removidos.
                // La función de PostgreSQL retorna una tabla con los campos de persona + status.

                await conn.OpenAsync();

                using var reader = await cmd.ExecuteReaderAsync();

                int errorOccurred = 1; // Default error
                string errorMensaje = "No se obtuvo respuesta de la base de datos.";
                bool resultado = false;

                if (await reader.ReadAsync())
                {
                    // Lee los datos de la persona
                    res.Persona = new Persona
                    {
                        PersonaId = reader.IsDBNull(reader.GetOrdinal("id_persona"))
                            ? 0
                            : reader.GetInt32(reader.GetOrdinal("id_persona")),
                        NumCedula = reader.IsDBNull(reader.GetOrdinal("num_cedula"))
                            ? 0
                            : reader.GetInt32(reader.GetOrdinal("num_cedula")),
                        FechaNacimiento = reader.IsDBNull(reader.GetOrdinal("fecha_nacimiento"))
                            ? DateTime.MinValue
                            : reader.GetDateTime(reader.GetOrdinal("fecha_nacimiento")),
                        PrimerNombre = reader.IsDBNull(reader.GetOrdinal("primer_nombre"))
                            ? ""
                            : reader.GetString(reader.GetOrdinal("primer_nombre")),
                        SegundoNombre = reader.IsDBNull(reader.GetOrdinal("segundo_nombre"))
                            ? null
                            : reader.GetString(reader.GetOrdinal("segundo_nombre")),
                        PrimerApellido = reader.IsDBNull(reader.GetOrdinal("primer_apellido"))
                            ? ""
                            : reader.GetString(reader.GetOrdinal("primer_apellido")),
                        SegundoApellido = reader.IsDBNull(reader.GetOrdinal("segundo_apellido"))
                            ? ""
                            : reader.GetString(reader.GetOrdinal("segundo_apellido")),
                        Correo = reader.IsDBNull(reader.GetOrdinal("correo"))
                            ? ""
                            : reader.GetString(reader.GetOrdinal("correo")),
                        Direccion = reader.IsDBNull(reader.GetOrdinal("direccion"))
                            ? ""
                            : reader.GetString(reader.GetOrdinal("direccion")),
                        Telefono1 = reader.IsDBNull(reader.GetOrdinal("telefono_1"))
                            ? 0
                            : reader.GetInt32(reader.GetOrdinal("telefono_1")),
                        Telefono2 = reader.IsDBNull(reader.GetOrdinal("telefono_2"))
                            ? 0
                            : reader.GetInt32(reader.GetOrdinal("telefono_2")),
                        IdRol = reader.IsDBNull(reader.GetOrdinal("id_rol"))
                            ? 0
                            : reader.GetInt32(reader.GetOrdinal("id_rol")),
                        Puesto = reader.IsDBNull(reader.GetOrdinal("puesto"))
                            ? ""
                            : reader.GetString(reader.GetOrdinal("puesto")),
                        CedulaResponsable = reader.IsDBNull(reader.GetOrdinal("cedula_responsable"))
                            ? (int?)null
                            : reader.GetInt32(reader.GetOrdinal("cedula_responsable")),
                        NombreRol = reader.IsDBNull(reader.GetOrdinal("nombre_rol"))
                            ? ""
                            : reader.GetString(reader.GetOrdinal("nombre_rol")),
                    };

                    // Lee los parámetros de salida (Status) de la misma fila
                    errorOccurred = reader.IsDBNull(reader.GetOrdinal("erroroccurred"))
                        ? 0
                        : reader.GetInt32(reader.GetOrdinal("erroroccurred"));
                    errorMensaje = reader.IsDBNull(reader.GetOrdinal("errormensaje"))
                        ? ""
                        : reader.GetString(reader.GetOrdinal("errormensaje"));
                    resultado = reader.IsDBNull(reader.GetOrdinal("resultado"))
                        ? false
                        : reader.GetBoolean(reader.GetOrdinal("resultado"));
                }

                // Procesar Status
                if (errorOccurred != 0 || !resultado)
                {
                    res.Resultado = false;
                    res.Mensaje = string.IsNullOrEmpty(errorMensaje) ? "Error en login." : errorMensaje;
                    return res;
                }

                res.Resultado = true;
                res.Mensaje = "Login exitoso.";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + "|" + ex.StackTrace);
                res.Resultado = false;
                res.Mensaje = "Error inesperado en el login.";
                res.ListaDeErrores.Add(ex.Message);
            }

            return res;
        }

        /// <summary>
        /// Updates a user's profile information.
        /// </summary>
        /// <param name="email">The unique email of the user (from the token).</param>
        /// <param name="req">The request object containing the updated profile data.</param>
        /// <returns>A Result object indicating success or failure.</returns>
        public async Task<ResActualizarPerfil> ActualizarPerfilAsync(string email, ReqActualizarPerfil req)
{
    var res = new ResActualizarPerfil();
    var parameters = new DynamicParameters();
    var updateClauses = new List<string>();

    if (req.FechaNacimiento != default)
    {
        updateClauses.Add("fecha_nacimiento = @FechaNacimiento");
        parameters.Add("FechaNacimiento", req.FechaNacimiento, DbType.DateTime);
    }

    if (!string.IsNullOrWhiteSpace(req.PrimerNombre))
    {
        updateClauses.Add("primer_nombre = @PrimerNombre");
        parameters.Add("PrimerNombre", req.PrimerNombre, DbType.String);
    }

    if (!string.IsNullOrWhiteSpace(req.SegundoNombre))
    {
        updateClauses.Add("segundo_nombre = @SegundoNombre");
        parameters.Add("SegundoNombre", req.SegundoNombre, DbType.String);
    }

    if (!string.IsNullOrWhiteSpace(req.PrimerApellido))
    {
        updateClauses.Add("primer_apellido = @PrimerApellido");
        parameters.Add("PrimerApellido", req.PrimerApellido, DbType.String);
    }

    if (!string.IsNullOrWhiteSpace(req.SegundoApellido))
    {
        updateClauses.Add("segundo_apellido = @SegundoApellido");
        parameters.Add("SegundoApellido", req.SegundoApellido, DbType.String);
    }

    if (!string.IsNullOrWhiteSpace(req.Direccion))
    {
        updateClauses.Add("direccion = @Direccion");
        parameters.Add("Direccion", req.Direccion, DbType.String);
    }

    if (req.Telefono1 != 0)
    {
        updateClauses.Add("telefono_1 = @Telefono1");
        parameters.Add("Telefono1", req.Telefono1);
    }

    if (req.Telefono2 != 0)
    {
        updateClauses.Add("telefono_2 = @Telefono2");
        parameters.Add("Telefono2", req.Telefono2);
    }

    if (updateClauses.Count == 0)
    {
        res.Resultado = true;
        res.Mensaje = "No se enviaron datos nuevos para actualizar.";
        return res;
    }

    var sqlBuilder = new StringBuilder();
    sqlBuilder.Append("UPDATE persona SET ");
    sqlBuilder.Append(string.Join(", ", updateClauses));
    sqlBuilder.Append(" WHERE correo = @Email;");

    parameters.Add("Email", email, DbType.String);

    try
    {
        using (var conn = new NpgsqlConnection(_connectionString))
        {
            var rowsAffected = await conn.ExecuteAsync(sqlBuilder.ToString(), parameters);

            if (rowsAffected == 0)
            {
                res.Resultado = false;
                res.ListaDeErrores.Add("Error: El usuario no se encontró.");
            }
            else
            {
                res.Resultado = true;
                res.Mensaje = "Perfil actualizado con éxito.";
            }
        }
    }
    catch (Exception ex)
    {
        res.Resultado = false;
        res.ListaDeErrores.Add($"Error de base de datos al actualizar el perfil: {ex.Message}");
    }

    return res;
}
    }
}