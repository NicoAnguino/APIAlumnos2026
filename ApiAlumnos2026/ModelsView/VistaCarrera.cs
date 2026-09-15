using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.ModelsView
{
  public class VistaCarrera
    {
        public int CarreraID { get; set; }
        public string? Nombre { get; set; }
        public int Duracion { get; set; }
        public bool Eliminado { get; set; }  
        public List<VistaAsignatura> Asignaturas { get; set; } 
    }
}