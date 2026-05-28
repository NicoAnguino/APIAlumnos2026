using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiAlumnos2026.Models;
using ApiAlumnos2026.ModelsView;
using Microsoft.AspNetCore.Identity;

namespace ApiAlumnos2026.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlumnosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AlumnosController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
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
                    Domicilio = alumno.Domicilio,
                    Email = alumno.Email
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

            try
            {

                var alumnoOriginal = _context.Alumnos.Where(n => n.AlumnoID == id).Single();

                //PREGUNTAR QUE CAMBIA
                if (alumnoOriginal.NombreCompleto != alumno.NombreCompleto)
                {
                    var editoAlumno = new HistorialAlumno
                    {
                        AlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "NOMBRE",
                        ValorAnterior = alumnoOriginal.NombreCompleto,
                        ValorNuevo = alumno.NombreCompleto,
                    };
                    _context.HistorialAlumnos.Add(editoAlumno);

                    var user = _context.Users.Where(n => n.Email == alumnoOriginal.Email).SingleOrDefault();
                    if (user != null)
                    {
                        user.NombreCompleto = alumno.NombreCompleto;
                    }
                }


                if (alumnoOriginal.DNI != alumno.DNI)
                {
                    var editoAlumno = new HistorialAlumno
                    {
                        AlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "DNI",
                        ValorAnterior = alumnoOriginal.DNI.ToString(),
                        ValorNuevo = alumno.DNI.ToString(),
                    };
                    _context.HistorialAlumnos.Add(editoAlumno);
                }


                if (alumnoOriginal.Sexo != alumno.Sexo)
                {
                    var editoAlumno = new HistorialAlumno
                    {
                        AlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "SEXO",
                        ValorAnterior = alumnoOriginal.Sexo.ToString(),
                        ValorNuevo = alumno.Sexo.ToString(),
                    };
                    _context.HistorialAlumnos.Add(editoAlumno);
                }


                if (alumnoOriginal.Domicilio != alumno.Domicilio)
                {
                    var editoAlumno = new HistorialAlumno
                    {
                        AlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "DOMICILIO",
                        ValorAnterior = alumnoOriginal.Domicilio,
                        ValorNuevo = alumno.Domicilio,
                    };
                    _context.HistorialAlumnos.Add(editoAlumno);
                }

                alumnoOriginal.NombreCompleto = alumno.NombreCompleto;
                alumnoOriginal.DNI = alumno.DNI;
                alumnoOriginal.Sexo = alumno.Sexo;
                alumnoOriginal.Domicilio = alumno.Domicilio;

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
        public async Task<ActionResult> PostAlumno(Alumno alumno)
        {

            if (!string.IsNullOrEmpty(alumno.NombreCompleto))
            {
                alumno.NombreCompleto = alumno.NombreCompleto?.ToUpper();
            }
            if (!string.IsNullOrEmpty(alumno.Email))
            {
                alumno.Email = alumno.Email?.ToLower();
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

            var user = new ApplicationUser
            {
                UserName = alumno.Email,
                Email = alumno.Email,
                NombreCompleto = alumno.NombreCompleto
            };

            //HACEMOS USO DEL MÉTODO REGISTRAR USUARIO
            var result = await _userManager.CreateAsync(user, "Ezpeleta_2026");

            if (result.Succeeded)
            {
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAlumno", new { id = alumno.AlumnoID }, alumno);
            }

            var error = "";
            foreach (var textoerror in result.Errors)
            {
                error += textoerror.Description;
            }

            return BadRequest(new
            {
                mensaje = error
            });
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
