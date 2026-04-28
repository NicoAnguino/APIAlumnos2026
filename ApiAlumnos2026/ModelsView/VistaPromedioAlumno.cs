using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace ApiAlumnos2026.ModelsView
{
    public class VistaPromedioAlumno
    {
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public decimal Promedio { get; set; }  
        public int DNI {get; set; }  
        // public string? SexoString {get; set;}   
        // public string? Domicilio {get;set;}
    }
}