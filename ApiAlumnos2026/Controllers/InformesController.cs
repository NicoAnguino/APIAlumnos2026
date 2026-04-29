using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiAlumnos2026.ModelsView;

namespace ApiAlumnos2026.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InformesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InformesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("promedioalumnos")]
        public async Task<ActionResult<IEnumerable<VistaPromedioAlumno>>> PostAsignatura(FiltroNotaAlumno filtro)
        {
            //INICIAMOS UN LISTADO VACIO DE TIPO VISTAPROMEDIOALUMNO PARA MOSTRAR EN PANTALLA
            List<VistaPromedioAlumno> alumnosMostrar = new List<VistaPromedioAlumno>();

            //BUSCAMOS TODOS LOS ALUMNOS DE LA BASE DE DATOS
            var alumnos = await _context.Alumnos.ToListAsync();
            //POR CADA ALUMNO LO RECORREMOS PARA BUSCAR SUS NOTAS 
            foreach (var alumno in alumnos)
            {
                //POR CADA ALUMNO BUSCO LAS NOTAS CORRESPONDIENTES
                var notasAlumno = await _context.NotasAlumnos.Where(a => a.AlumnoID == alumno.AlumnoID).ToListAsync();
                if (filtro.AsignaturaID > 0)
                {
                    //QUIERE DECIR QUE FILTRA POR ALGUNA ASIGNATURA EN PARTICULAR
                    notasAlumno = notasAlumno.Where(a => a.AsignaturaID == filtro.AsignaturaID).ToList();
                }

                DateTime fechaDesde = new DateTime();
                bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

                DateTime fechaHasta = new DateTime();
                bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

                if (fechaDesdeValida && fechaHastaValida)
                {
                    fechaHasta = fechaHasta.AddHours(23);
                    fechaHasta = fechaHasta.AddMinutes(59);
                    fechaHasta = fechaHasta.AddSeconds(59);
                    notasAlumno = notasAlumno.Where(t => t.Fecha >= fechaDesde && t.Fecha <= fechaHasta).ToList();
                }

                //PREGUNTAMOS SI ESE ALUMNO TIENE AL MENOS UNA NOTA PARA PODER MOSTRARLO
                if (notasAlumno.Count > 0)
                {
                    var alumnoMostrar = new VistaPromedioAlumno
                    {
                        NombreCompleto = alumno.NombreCompleto,
                        DNI = alumno.DNI,
                        Promedio = decimal.Round(Convert.ToDecimal(notasAlumno.Sum(n => n.Nota)) / notasAlumno.Count(), 2)
                    };
                    alumnosMostrar.Add(alumnoMostrar);
                }
            }

            alumnosMostrar = alumnosMostrar.OrderBy(a => a.NombreCompleto).ToList();

            return alumnosMostrar.ToList();
        }

    }
}
