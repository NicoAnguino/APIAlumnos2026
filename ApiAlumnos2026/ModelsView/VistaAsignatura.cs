using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.ModelsView
{
  public class VistaAsignatura
    {
        public int AsignaturaID { get; set; }
        public string? Descripcion { get; set; }
        public bool Eliminado { get; set; }  
    }
}