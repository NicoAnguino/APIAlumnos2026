using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class Carrera
    {
        [Key]
        public int CarreraID { get; set; }
        public string? Nombre { get; set; }
        public int Duracion { get; set; }
        public bool Eliminado {get; set; }

        public virtual ICollection<Asignatura>? Asignaturas {get; set; }
    }
}