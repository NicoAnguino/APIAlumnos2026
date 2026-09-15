using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiAlumnos2026.Models;
using ApiAlumnos2026.ModelsView;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ApiAlumnos2026.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CarrerasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarrerasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Carreras
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VistaCarrera>>> GetCarreras()
        {
            List<VistaCarrera> vistaCarreras = new List<VistaCarrera>();

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                //BUSCAMOS EL USUARIO PARA SABER EL EMAIL
                var usuario = _context.Users.Where(d => d.Id == userId).Single();
                if (usuario.Email != "admin@gmail.com")
                {
                    //BUSCAMOS EL DOCENTE RELACIONADO
                    var docente = _context.Docentes.Where(d => d.Email == usuario.Email).SingleOrDefault();

                    if (docente != null)
                    {
                        //DE ESE DOCENTE VER LAS ASIGNATURAS QUE TIENE
                        var asignaturasDocente = _context.AsignaturasDocentes.Where(a => a.DocenteID == docente.DocenteID).ToList();

                        foreach (var asignaturaDocente in asignaturasDocente)
                        {
                            var asignatura = _context.Asignaturas.Where(a => a.AsignaturaID == asignaturaDocente.AsignaturaID).Single();
                            var carrera = _context.Carreras.Where(a => a.CarreraID == asignatura.CarreraID).Single();

                            var carreraMostrar = vistaCarreras.Where(c => c.CarreraID == carrera.CarreraID).SingleOrDefault();
                            if (carreraMostrar == null)
                            {
                                carreraMostrar = new VistaCarrera
                                {
                                    CarreraID = carrera.CarreraID,
                                    Nombre = carrera.Nombre,
                                    Duracion = carrera.Duracion,
                                    Eliminado = carrera.Eliminado
                                };
                                vistaCarreras.Add(carreraMostrar);
                            }
                        }
                    }
                }
                else
                {
                    var carreras = await _context.Carreras.Where(a => a.Eliminado == false).OrderBy(n => n.Nombre).ToListAsync();

                    foreach (var carrera in carreras)
                    {
                        var elemento = new VistaCarrera
                        {
                            CarreraID = carrera.CarreraID,
                            Nombre = carrera.Nombre,
                            Duracion = carrera.Duracion,
                            Eliminado = carrera.Eliminado
                        };
                        vistaCarreras.Add(elemento);
                    }
                }
            }

            return vistaCarreras;
        }

        // GET: api/Carreras/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Carrera>> GetCarrera(int id)
        {
            var carrera = await _context.Carreras.FindAsync(id);

            if (carrera == null)
            {
                return NotFound();
            }

            return carrera;
        }



        // PUT: api/Carreras/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCarrera(int id, Carrera carrera)
        {
            if (id != carrera.CarreraID)
            {
                return BadRequest();
            }

            if (!string.IsNullOrEmpty(carrera.Nombre))
            {
                carrera.Nombre = carrera.Nombre?.ToUpper();
            }

            var carreraExiste = await _context.Carreras.Where(t => t.Nombre == carrera.Nombre && t.CarreraID != carrera.CarreraID).FirstOrDefaultAsync();

            if (carreraExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe una carrera con ese nombre." });
            }

            _context.Entry(carrera).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarreraExists(id))
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
        public async Task<ActionResult<Carrera>> PostCarrera(Carrera carrera)
        {

            if (!string.IsNullOrEmpty(carrera.Nombre))
            {
                carrera.Nombre = carrera.Nombre?.ToUpper();
            }

            var carreraExiste = await _context.Carreras.Where(t => t.Nombre == carrera.Nombre).FirstOrDefaultAsync();

            if (carreraExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe una carrera con ese nombre." });
            }

            _context.Carreras.Add(carrera);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCarrera", new { id = carrera.CarreraID }, carrera);
        }

        // DELETE: api/Carreras/5 esta seccion del aplicativo no se usa el delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCarrera(int id)
        {
            var carrera = await _context.Carreras.FindAsync(id);
            if (carrera == null)
            {
                return NotFound();
            }
            carrera.Eliminado = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool CarreraExists(int id)
        {
            return _context.Carreras.Any(e => e.CarreraID == id);
        }
    }
}
