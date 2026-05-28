using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.Models
{
    public class HistorialDocente
    {
        [Key]
        public int HistorialDocenteID { get; set; }
        public int DocenteID { get; set; }
        public DateTime FechaCambio { get; set; }
        public string? CampoModificado { get; set; }
        public string? ValorAnterior { get; set; }
        public string? ValorNuevo { get; set; }
    }


  public class VistaHistorialDocente
    {
        public int HistorialDocenteID { get; set; }
        public int DocenteID { get; set; }
        public string? FechaCambioString { get; set; }
        public string? CampoModificado { get; set; }
        public string? ValorAnterior { get; set; }
        public string? ValorNuevo { get; set; }
    }

    
}