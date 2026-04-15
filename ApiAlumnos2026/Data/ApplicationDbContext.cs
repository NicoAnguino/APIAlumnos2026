using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ApiAlumnos2026.Models;

using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>

{

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)

        : base(options)

    {

    }

 

    // Agrega tus DbSet aquí
    public DbSet<NotaAlumno> NotasAlumnos { get; set; }
    public DbSet<Alumno> Alumnos { get; set; }
    public DbSet<Docente> Docentes { get; set; }
    public DbSet<Asignatura> Asignaturas { get; set; }
}