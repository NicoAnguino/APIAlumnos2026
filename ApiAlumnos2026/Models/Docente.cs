using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class Docente
    {
        [Key]
        public int DocenteID { get; set; }
        public string? NombreCompleto { get; set; }
        public int DNI {get; set; }

        public Sexo Sexo {get; set;}
    }

    public enum Sexo
    {
        Masculino = 1,
        Femenino,
        Otro
    }


}