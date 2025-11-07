namespace API.Models.Request;

public class ReqActualizarClase
{
    public int Id { get; set; }
    public string NombreClase { get; set; }
    public string Modalidad { get; set; }
    
    public string Descripcion { get; set; }
    public string Imagen { get; set; }

}