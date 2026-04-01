using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class NotaAlumno
    {
        [Key]
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public int Nota { get; set; }       
        public int DNI {get; set; }
    }


    public class VistaNotaAlumno
    {
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public int Nota { get; set; }  
        public int DNI {get; set; }     
    }
}