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

            var notasAlumnos = await _context.NotasAlumnos.Include(a => a.Asignatura).Include(a => a.Alumno).OrderBy(n => n.Alumno.NombreCompleto).ToListAsync();

            foreach (var notaAlumno in notasAlumnos)
            {
                var mostrarNotaAlumno = new VistaNotaAlumno
                {
                    NotaAlumnoID = notaAlumno.NotaAlumnoID,
                    AlumnoID = notaAlumno.AlumnoID,
                    NombreCompleto = notaAlumno.Alumno?.NombreCompleto,
                    AsignaturaID = notaAlumno.AsignaturaID,
                    AsignaturaNombre = notaAlumno.Asignatura.Descripcion,
                    FechaString = notaAlumno.Fecha.ToString("dd/MM/yyyy"),
                    FechaStringInput = notaAlumno.Fecha.ToString("yyyy-MM-dd"),
                    DNI = notaAlumno.Alumno.DNI,
                    Nota = notaAlumno.Nota
                };
                vistaNotasAlumnos.Add(mostrarNotaAlumno);
                
            }


            // //traspaso de datos

            // //BUSCAR LAS NOTA ALUMNOS PARA SACAR LA INFO DE ALUMNOS
            // foreach (var notaAlumno in notasAlumnos)
            // {
            //     //BUSCAR EN LA TABLA ALUMNO SI EXISTE ESE ALUMNO
            //     var alumno = _context.Alumnos.Where(a => a.DNI == notaAlumno.Alumno.DNI).SingleOrDefault();
            //     if (alumno == null)
            //     {
            //         // //CREAR ALUMNO
            //         alumno = new Alumno
            //         {
            //             NombreCompleto = notaAlumno.Alumno?.NombreCompleto,
            //             DNI = notaAlumno.Alumno.DNI,
            //             Sexo = Sexo.Otro,
            //             Domicilio = ""
            //         };
            //         //LO AGREGAMOS A LA TABLA
            //          _context.Alumnos.Add(alumno);
            //          //GUARDAMOS LOS CAMBIOS
            //         await _context.SaveChangesAsync();

            //         //ASIGNAMOS EL ALUMNOID GENERADO AL REGISTRO DE NOTA ALUMNO
            //         notaAlumno.AlumnoID = alumno.AlumnoID;
            //           await _context.SaveChangesAsync();
            //     }
            // }
            // //fin traspaso de datos

            return vistaNotasAlumnos; 
        }

        // GET: api/NotasAlumnos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VistaNotaAlumno>> GetNotaAlumno(int id)
        {
            var notaAlumno = await _context.NotasAlumnos.Include(a => a.Asignatura).Include(a => a.Alumno).Where(n => n.NotaAlumnoID == id).SingleOrDefaultAsync();

            if (notaAlumno == null)
            {
                return NotFound();
            }

             var mostrarNotaAlumno = new VistaNotaAlumno
                {
                    NotaAlumnoID = notaAlumno.NotaAlumnoID,
                    AlumnoID = notaAlumno.AlumnoID,
                    NombreCompleto = notaAlumno.Alumno?.NombreCompleto,
                    AsignaturaID = notaAlumno.AsignaturaID,
                    AsignaturaNombre = notaAlumno.Asignatura.Descripcion,
                    FechaString = notaAlumno.Fecha.ToString("dd/MM/yyyy"),
                    FechaStringInput = notaAlumno.Fecha.ToString("yyyy-MM-dd"),
                    DNI = notaAlumno.Alumno.DNI,
                    Nota = notaAlumno.Nota
                };

            return mostrarNotaAlumno;
        }



        // PUT: api/NotasAlumnos/5
    [HttpPut("{id}")]
        public async Task<IActionResult> PutNotaAlumno(int id, NotaAlumno notaAlumno)
        {
            if (id != notaAlumno.NotaAlumnoID)
            {
                return BadRequest();
            }

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
 
            
            _context.NotasAlumnos.Add(notaAlumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotaAlumno", new { id = notaAlumno.NotaAlumnoID }, notaAlumno);
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
            return _context.NotasAlumnos.Any(e => e.NotaAlumnoID == id);
        }
    }
}
