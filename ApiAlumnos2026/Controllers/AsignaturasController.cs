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
    public class AsignaturasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AsignaturasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Asignaturas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VistaAsignatura>>> GetAsignaturas()
        {
            List<VistaAsignatura> vistaAsignaturas = new List<VistaAsignatura>();

            //BUSCAMOS EL USUARIO ID
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var asignaturas = await BuscarAsignaturasAsync(userId);

            foreach (var asignatura in asignaturas)
            {
                var elemento = new VistaAsignatura
                {
                    AsignaturaID = asignatura.AsignaturaID,
                    Descripcion = asignatura.Descripcion,
                    Eliminado = asignatura.Eliminado
                };
                vistaAsignaturas.Add(elemento);
            }

            return vistaAsignaturas;
        }


        public async Task<List<Asignatura>> BuscarAsignaturasAsync(string userId)
        {
            List<Asignatura> asignaturas = new List<Asignatura>();
            if (userId != null)
            {
                var usuario = _context.Users.Where(d => d.Id == userId).Single();

                //DISTINTO AL ADMIN
                if (usuario.Email != "admin@gmail.com")
                {
                    var docente = _context.Docentes.Where(d => d.Email == usuario.Email).SingleOrDefault();

                    if (docente != null)
                    {
                        //DE ESE DOCENTE VER LAS ASIGNATURAS QUE TIENE
                        var asignaturasDocente = _context.AsignaturasDocentes.Where(a => a.DocenteID == docente.DocenteID).ToList();

                        foreach (var asignaturaDocente in asignaturasDocente)
                        {
                            var asignatura = _context.Asignaturas.Where(a => a.AsignaturaID == asignaturaDocente.AsignaturaID).Single();
                            asignaturas.Add(asignatura);

                        }
                    }
                }
                else
                {
                    asignaturas.AddRange(_context.Asignaturas
                                        .Where(a => a.Eliminado == false) // Filtrando por userId (si corresponde)
                                        .OrderBy(n => n.Descripcion)
                                        .ToList());
                }
            }

            return asignaturas;
        }


        // GET: api/Asignaturas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Asignatura>> GetAsignatura(int id)
        {
            var asignatura = await _context.Asignaturas.FindAsync(id);

            if (asignatura == null)
            {
                return NotFound();
            }

            return asignatura;
        }

        // GET: api/Asignaturas/5
        [HttpGet("AsignaturasCarrera/{id}")]
        public async Task<ActionResult<IEnumerable<Asignatura>>> GetAsignaturasCarrera(int id)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var asignaturas = await BuscarAsignaturasAsync(userId);

            asignaturas = asignaturas.Where(a => a.CarreraID == id).ToList();

            return asignaturas;
        }

        [HttpGet("AsignaturasPorCarreras")]
        public async Task<ActionResult<IEnumerable<VistaCarrera>>> GetAsignaturasPorCarreras()
        {
            List<VistaCarrera> carrerasMostrar = new List<VistaCarrera>();

            //BUSCAMOS EL USUARIO ID
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                //BUSCAMOS EL USUARIO PARA SABER EL EMAIL
                var usuario = _context.Users.Where(d => d.Id == userId).Single();

                //DISTINTO AL ADMIN
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
                            var asignatura = _context.Asignaturas.Include(a => a.Carrera).Where(a => a.AsignaturaID == asignaturaDocente.AsignaturaID).Single();

                            //ANTES DE AGREGAR LA ASIGNATURA VER SI EXISTE LA CARRERA A LA QUE PERTENECE
                            var carrera = carrerasMostrar.Where(c => c.CarreraID == asignatura.CarreraID).SingleOrDefault();
                            if (carrera == null)
                            {
                                carrera = new VistaCarrera
                                {
                                    CarreraID = asignatura.CarreraID,
                                    Nombre = asignatura.Carrera.Nombre,
                                    Duracion = asignatura.Carrera.Duracion,
                                    Eliminado = asignatura.Eliminado,
                                    Asignaturas = new List<VistaAsignatura>()
                                };
                                carrerasMostrar.Add(carrera);

                                carrerasMostrar = carrerasMostrar.OrderBy(c => c.Nombre).ToList();
                            }

                            var elemento = new VistaAsignatura
                            {
                                AsignaturaID = asignatura.AsignaturaID,
                                Descripcion = asignatura.Descripcion,
                                Anio = asignatura.Anio,
                                Eliminado = asignatura.Eliminado
                            };
                            carrera.Asignaturas.Add(elemento);

                            carrera.Asignaturas = carrera.Asignaturas.OrderBy(c => c.Anio).ThenBy(c => c.Descripcion).ToList();

                        }
                    }
                }
                else
                {
                    var asignaturas = await _context.Asignaturas.Include(a => a.Carrera).Where(a => a.Eliminado == false).OrderBy(n => n.Descripcion).ToListAsync();

                    foreach (var asignatura in asignaturas)
                    {
                        //ANTES DE AGREGAR LA ASIGNATURA VER SI EXISTE LA CARRERA A LA QUE PERTENECE
                        var carrera = carrerasMostrar.Where(c => c.CarreraID == asignatura.CarreraID).SingleOrDefault();
                        if (carrera == null)
                        {
                            carrera = new VistaCarrera
                            {
                                CarreraID = asignatura.CarreraID,
                                Nombre = asignatura.Carrera.Nombre,
                                Duracion = asignatura.Carrera.Duracion,
                                Eliminado = asignatura.Eliminado,
                                Asignaturas = new List<VistaAsignatura>()
                            };
                            carrerasMostrar.Add(carrera);

                            carrerasMostrar = carrerasMostrar.OrderBy(c => c.Nombre).ToList();
                        }

                        var elemento = new VistaAsignatura
                        {
                            AsignaturaID = asignatura.AsignaturaID,
                            Descripcion = asignatura.Descripcion,
                            Anio = asignatura.Anio,
                            Eliminado = asignatura.Eliminado
                        };
                        carrera.Asignaturas.Add(elemento);

                        carrera.Asignaturas = carrera.Asignaturas.OrderBy(c => c.Anio).ThenBy(c => c.Descripcion).ToList();

                    }
                }
            }

            return carrerasMostrar;
        }



        // PUT: api/Asignaturas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsignatura(int id, Asignatura asignatura)
        {
            if (id != asignatura.AsignaturaID)
            {
                return BadRequest();
            }

            if (!string.IsNullOrEmpty(asignatura.Descripcion))
            {
                asignatura.Descripcion = asignatura.Descripcion?.ToUpper();
            }

            var asignaturaExiste = await _context.Asignaturas.Where(t => t.Descripcion == asignatura.Descripcion && t.AsignaturaID != asignatura.AsignaturaID).FirstOrDefaultAsync();

            if (asignaturaExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe un alumno con ese dni." });
            }

            _context.Entry(asignatura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AsignaturaExists(id))
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
        public async Task<ActionResult<Asignatura>> PostAsignatura(Asignatura asignatura)
        {

            if (!string.IsNullOrEmpty(asignatura.Descripcion))
            {
                asignatura.Descripcion = asignatura.Descripcion?.ToUpper();
            }

            var asignaturaExiste = await _context.Asignaturas.Where(t => t.Descripcion == asignatura.Descripcion).FirstOrDefaultAsync();

            if (asignaturaExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe una asignatura con ese dni." });
            }

            _context.Asignaturas.Add(asignatura);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAsignatura", new { id = asignatura.AsignaturaID }, asignatura);
        }

        // DELETE: api/Asignaturas/5 esta seccion del aplicativo no se usa el delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsignatura(int id)
        {
            var asignatura = await _context.Asignaturas.FindAsync(id);
            if (asignatura == null)
            {
                return NotFound();
            }
            asignatura.Eliminado = true;
            //_context.Asignaturas.Remove(asignatura);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool AsignaturaExists(int id)
        {
            return _context.Asignaturas.Any(e => e.AsignaturaID == id);
        }
    }
}
