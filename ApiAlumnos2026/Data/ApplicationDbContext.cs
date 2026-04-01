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
}