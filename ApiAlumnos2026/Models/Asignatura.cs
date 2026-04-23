using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class Asignatura
    {
        [Key]
        public int AsignaturaID { get; set; }
        public string? Descripcion { get; set; }
        public bool Eliminado {get; set; }

        public virtual ICollection<NotaAlumno>? NotasAlumnos {get; set; }
    }


  public class VistaAsignatura
    {
        public int AsignaturaID { get; set; }
        public string? Descripcion { get; set; }
        public bool Eliminado { get; set; }  
    }
}