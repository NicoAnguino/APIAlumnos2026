using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class Asignatura
    {
        [Key]
        public int AsignaturaID { get; set; }
        public string? Descripcion { get; set; }
        public int CarreraID { get; set; }
        public int Anio { get; set; }
        public bool Eliminado { get; set; }

        public virtual Carrera? Carrera { get; set; }
        public virtual ICollection<NotaAlumno>? NotasAlumnos { get; set; }
    }
}