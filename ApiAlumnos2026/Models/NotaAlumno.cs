using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class NotaAlumno
    {
        [Key]
        public int NotaAlumnoID {get;set;}
        public DateTime Fecha {get;set;}
        public int AlumnoID { get; set; }
        public int AsignaturaID { get; set; }
        public int Nota { get; set; }       
        public virtual Alumno? Alumno {get; set; }
        public virtual Asignatura? Asignatura {get; set; }
    }


    public class VistaNotaAlumno
    {
        public int NotaAlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public int Nota { get; set; }  
        public int DNI {get; set; }     
    }
}