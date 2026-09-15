using System.ComponentModel.DataAnnotations;
using ApiAlumnos2026.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace ApiAlumnos2026.ModelsView
{
    public class VistaNotaAlumno
    {
        public int NotaAlumnoID { get; set; }
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public int AsignaturaID { get; set; }
        public string? AsignaturaNombre { get; set; }
        public TipoInstancia TipoInstancia { get; set; }
        public string? TipoInstanciaNombre { get; set; }
        public string? FechaString { get; set; }
        public string? FechaStringInput { get; set; }
        public int Nota { get; set; }
        public int DNI { get; set; }
    }

    public class VistaPromedioAlumno
    {
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public decimal Promedio { get; set; }
        public int DNI { get; set; }
        // public string? SexoString {get; set;}   
        // public string? Domicilio {get;set;}
    }


    public class VistaPromedioAsignatura
    {
        public int AsignaturaID { get; set; }
        public string? AsignaturaNombre { get; set; }
        public decimal Promedio { get; set; }
    }


    public class VistaAlumnoNotas
    {
        public int AlumnoID { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public int DNI { get; set; }
        public int AsignaturaID { get; set; }
        public string AsignaturaNombre { get; set; } = string.Empty;

        // Instancias de evaluación
        public int? NotaIEv1 { get; set; }
        public int? NotaIEv2 { get; set; }
        public int? NotaIEv3 { get; set; }
        public int? NotaIEv4 { get; set; }
        public int? NotaRec1 { get; set; }
        public int? NotaRec2 { get; set; }
        public int? NotaIEFI { get; set; }
        public int? NotaRIEFI { get; set; }
    }
}