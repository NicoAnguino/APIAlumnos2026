using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class HistorialAlumno
    {
        [Key]
        public int HistorialAlumnoID { get; set; }
        public int AlumnoID { get; set; }
        public DateTime FechaCambio { get; set; }
        public string? CampoModificado { get; set; }
        public string? ValorAnterior { get; set; }
        public string? ValorNuevo { get; set; }
    }


  public class VistaHistorialAlumno
    {
        public int HistorialAlumnoID { get; set; }
        public int AlumnoID { get; set; }
        public string? FechaCambioString { get; set; }
        public string? CampoModificado { get; set; }
        public string? ValorAnterior { get; set; }
        public string? ValorNuevo { get; set; }
    }

    
}