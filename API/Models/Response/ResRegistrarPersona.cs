using API.Models.Entities;

namespace API.Models.Response
{
    public class ResRegistrarPersona : ResBase
    {
        public Persona Persona { get; set; }
        public string PasswordTemporal { get; set; } = string.Empty;
        
        /// <summary>
        /// Contraseña asociada a la operación.
        /// </summary>
        public string Password { get; set; }
    }
}

