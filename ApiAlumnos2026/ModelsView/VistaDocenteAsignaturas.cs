using System.ComponentModel.DataAnnotations;

namespace ApiAlumnos2026.ModelsView
{
  public class VistaDocenteAsignaturas
  {
    //POR CADA DOCENTE VAMOS A GUARDAR EN MEMORIA EL LISTADO DE ASIGNATURAS QUE TIENE A CARGO
    public int DocenteID { get; set; }
    public string? NombreCompleto { get; set; }
    public int DNI { get; set; }
    public string? Email { get; set; }
    public List<VistaAsignatura> ListadoAsignaturas { get; set; }
  }
}