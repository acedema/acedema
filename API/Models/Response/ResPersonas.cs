using API.Models.Entities;

namespace API.Models.Response;

public class ResPersonas : ResBase
{
    
    /// <summary>
    /// Objeto con la información completa de la persona consultada.
    /// </summary>
    public List<Persona>? Personas { get; set; }
}