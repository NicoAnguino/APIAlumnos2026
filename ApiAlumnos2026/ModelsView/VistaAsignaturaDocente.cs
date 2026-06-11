using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.ModelsView
{
  public class VistaAsignaturaDocente
    {
        public int AsignaturaDocenteID { get; set; }
        public int AsignaturaID { get; set; }
        public string? Descripcion {get;set;}
    }
}