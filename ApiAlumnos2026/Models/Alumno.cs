using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace ApiAlumnos2026.Models
{
    public class Alumno
    {
        [Key]
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public int DNI {get; set; }
        public Sexo Sexo {get; set;}
        public string? Domicilio {get;set;}
    }
}