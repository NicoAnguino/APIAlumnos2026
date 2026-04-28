using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace ApiAlumnos2026.ModelsView
{
      public class FiltroNotaAlumno
    {
        public string? FechaDesde { get; set; }
        public string? FechaHasta { get; set; }
        public int? AsignaturaID { get; set; }
        public int? AlumnoID { get; set; }
    }
}