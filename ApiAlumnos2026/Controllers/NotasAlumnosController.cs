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
    public class NotasAlumnosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotasAlumnosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/NotasAlumnos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VistaNotaAlumno>>> GetNotasAlumnos()
        {
            List<VistaNotaAlumno> vistaNotasAlumnos = new List<VistaNotaAlumno>();

            var notasAlumnos = await _context.NotasAlumnos.OrderBy(n => n.NombreCompleto).ToListAsync();

            foreach (var notaAlumno in notasAlumnos)
            {
                var mostrarNotaAlumno = new VistaNotaAlumno
                {
                    AlumnoID = notaAlumno.AlumnoID,
                    NombreCompleto = notaAlumno.NombreCompleto,
                    DNI = notaAlumno.DNI,
                    Nota = notaAlumno.Nota
                };
                vistaNotasAlumnos.Add(mostrarNotaAlumno);
                
            }
            
            return vistaNotasAlumnos; 
        }

        // GET: api/NotasAlumnos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotaAlumno>> GetNotaAlumno(int id)
        {
            var notaAlumno = await _context.NotasAlumnos.FindAsync(id);

            if (notaAlumno == null)
            {
                return NotFound();
            }

            return notaAlumno;
        }



        // PUT: api/NotasAlumnos/5
    [HttpPut("{id}")]
        public async Task<IActionResult> PutNotaAlumno(int id, NotaAlumno notaAlumno)
        {
            if (id != notaAlumno.AlumnoID)
            {
                return BadRequest();
            }

            notaAlumno.NombreCompleto = notaAlumno.NombreCompleto?.ToUpper();

            _context.Entry(notaAlumno).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotaAlumnoExists(id))
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
        public async Task<ActionResult<NotaAlumno>> PostNotaAlumno(NotaAlumno notaAlumno)
        {

            notaAlumno.NombreCompleto = notaAlumno.NombreCompleto?.ToUpper();

            var alumnoExiste = await _context.NotasAlumnos.Where(t => t.NombreCompleto == notaAlumno.NombreCompleto).FirstOrDefaultAsync();

            if (alumnoExiste != null)
            {
                 return Conflict(new { mensaje = "Ya existe un tipo de actividad con ese nombre." });
            }   
            
            _context.NotasAlumnos.Add(notaAlumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotaAlumno", new { id = notaAlumno.AlumnoID }, notaAlumno);
        }

        // DELETE: api/NotasAlumnos/5 esta seccion del aplicativo no se usa el delete
         [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotaAlumno(int id)
        {
            var notaAlumno = await _context.NotasAlumnos.FindAsync(id);
            if (notaAlumno == null)
            {
                return NotFound();
            }

            _context.NotasAlumnos.Remove(notaAlumno);
            await _context.SaveChangesAsync();

            return Ok();
        } 

        private bool NotaAlumnoExists(int id)
        {
            return _context.NotasAlumnos.Any(e => e.AlumnoID == id);
        }
    }
}
