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
    public class DocentesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DocentesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Docentes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Docente>>> GetDocentes()
        {
            var docentes = await _context.Docentes.OrderBy(n => n.NombreCompleto).ToListAsync();

            return docentes;
        }

        // GET: api/Docentes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Docente>> GetDocente(int id)
        {
            var docente = await _context.Docentes.FindAsync(id);

            if (docente == null)
            {
                return NotFound();
            }

            return docente;
        }



        // PUT: api/Docentes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocente(int id, Docente docente)
        {
            if (id != docente.DocenteID)
            {
                return BadRequest();
            }

            if (!string.IsNullOrEmpty(docente.NombreCompleto))
            {
                docente.NombreCompleto = docente.NombreCompleto?.ToUpper();
            }

            var docenteExiste = await _context.Docentes.Where(t => t.DNI == docente.DNI && t.DocenteID != docente.DocenteID).FirstOrDefaultAsync();

            if (docenteExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe un docente con ese dni." });
            }

            _context.Entry(docente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocenteExists(id))
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
        public async Task<ActionResult<Docente>> PostAlumno(Docente docente)
        {

            if (!string.IsNullOrEmpty(docente.NombreCompleto))
            {
                docente.NombreCompleto = docente.NombreCompleto?.ToUpper();
            }
            var docenteExiste = await _context.Docentes.Where(t => t.DNI == docente.DNI).FirstOrDefaultAsync();

            if (docenteExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe un docente con ese dni." });
            }

            _context.Docentes.Add(docente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDocente", new { id = docente.DocenteID }, docente);
        }

        // DELETE: api/Docentes/5 esta seccion del aplicativo no se usa el delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocente(int id)
        {
            var docente = await _context.Docentes.FindAsync(id);
            if (docente == null)
            {
                return NotFound();
            }

            _context.Docentes.Remove(docente);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool DocenteExists(int id)
        {
            return _context.Docentes.Any(e => e.DocenteID == id);
        }
    }
}
