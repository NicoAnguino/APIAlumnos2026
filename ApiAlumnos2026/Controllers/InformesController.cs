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
            List<VistaPromedioAlumno> alumnosMostrar = new List<VistaPromedioAlumno>();

            var alumnos = await _context.Alumnos.ToListAsync();
            foreach (var alumno in alumnos)
            {
                var notasAlumno = await _context.NotasAlumnos.Where(a => a.AlumnoID == alumno.AlumnoID).ToListAsync();
                if (filtro.AsignaturaID > 0)
                {
                    notasAlumno = notasAlumno.Where(a => a.AsignaturaID == filtro.AsignaturaID).ToList();
                }
                if (notasAlumno.Count > 0)
                {
                    var promedioNotaAlumno = decimal.Round(Convert.ToDecimal(notasAlumno.Sum(n => n.Nota)) / notasAlumno.Count(), 2);

                    var alumnoMostrar = new VistaPromedioAlumno
                    {
                        NombreCompleto = alumno.NombreCompleto,
                        DNI = alumno.DNI,
                        Promedio = promedioNotaAlumno
                    };
                    alumnosMostrar.Add(alumnoMostrar);
                }
            }

            alumnosMostrar = alumnosMostrar.OrderBy(a => a.NombreCompleto).ToList();

            return alumnosMostrar.ToList();
        }

    }
}
