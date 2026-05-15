using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace ApiAlumnos2026.ModelsView
{
    public class VistaAlumno
    {
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }     
        public int DNI {get; set; }  
        public string? SexoString {get; set;}   
        public string? Domicilio {get;set;}
        public int NotaIEv1 { get; set; }  //NOTA 0 EQUIVALE A AUSENTE
        public int NotaIEv2 { get; set; }  
        public int NotaIEv3 { get; set; }  
        public int NotaIEv4 { get; set; }  
        public int NotaRec1 { get; set; }  
        public int NotaRec2 { get; set; }
        public int NotaIEFI { get; set; }
        public int NotaRIEFI { get; set; }      
    }
}