using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiAlumnos2026.Models;

namespace ApiAlumnos2026.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlumnosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AlumnosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Alumnos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VistaAlumno>>> GetAlumnos()
        {
            List<VistaAlumno> vistaAlumnos = new List<VistaAlumno>();

            var alumnos = await _context.Alumnos.OrderBy(n => n.NombreCompleto).ToListAsync();

            foreach (var alumno in alumnos)
            {
                var mostraAlumno = new VistaAlumno
                {
                    AlumnoID = alumno.AlumnoID,
                    NombreCompleto = alumno.NombreCompleto,
                    DNI = alumno.DNI,
                    Domicilio = alumno.Domicilio
                };
                vistaAlumnos.Add(mostraAlumno);

            }

            return vistaAlumnos;
        }

        // GET: api/Alumnos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Alumno>> GetAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);

            if (alumno == null)
            {
                return NotFound();
            }

            return alumno;
        }



        // PUT: api/Alumnos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlumno(int id, Alumno alumno)
        {
            if (id != alumno.AlumnoID)
            {
                return BadRequest();
            }

            if (!string.IsNullOrEmpty(alumno.NombreCompleto))
            {
                alumno.NombreCompleto = alumno.NombreCompleto?.ToUpper();
            }

            if (!string.IsNullOrEmpty(alumno.Domicilio))
            {
                alumno.Domicilio = alumno.Domicilio?.ToUpper();
            }

            var alumnoExiste = await _context.Alumnos.Where(t => t.DNI == alumno.DNI && t.AlumnoID != alumno.AlumnoID).FirstOrDefaultAsync();

            if (alumnoExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe un alumno con ese dni." });
            }

            _context.Entry(alumno).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlumnoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Alumno>> PostAlumno(Alumno alumno)
        {

            if (!string.IsNullOrEmpty(alumno.NombreCompleto))
            {
                alumno.NombreCompleto = alumno.NombreCompleto?.ToUpper();
            }

            if (!string.IsNullOrEmpty(alumno.Domicilio))
            {
                alumno.Domicilio = alumno.Domicilio?.ToUpper();
            }
            var alumnoExiste = await _context.Alumnos.Where(t => t.DNI == alumno.DNI).FirstOrDefaultAsync();

            if (alumnoExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe un alumno con ese dni." });
            }

            _context.Alumnos.Add(alumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAlumno", new { id = alumno.AlumnoID }, alumno);
        }

        // DELETE: api/Alumnos/5 esta seccion del aplicativo no se usa el delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
            {
                return NotFound();
            }

            _context.Alumnos.Remove(alumno);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool AlumnoExists(int id)
        {
            return _context.Alumnos.Any(e => e.AlumnoID == id);
        }
    }
}
