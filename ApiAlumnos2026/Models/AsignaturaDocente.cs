using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class AsignaturaDocente
    {
        [Key]
        public int AsignaturaDocenteID { get; set; }
        public int AsignaturaID { get; set; }
        public int DocenteID { get; set; }
    }
}