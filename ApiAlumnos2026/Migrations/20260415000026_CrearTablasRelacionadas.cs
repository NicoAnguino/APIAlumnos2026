using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiAlumnos2026.Migrations
{
    /// <inheritdoc />
    public partial class CrearTablasRelacionadas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AlumnoID",
                table: "NotasAlumnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AsignaturaID",
                table: "NotasAlumnos",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlumnoID",
                table: "NotasAlumnos");

            migrationBuilder.DropColumn(
                name: "AsignaturaID",
                table: "NotasAlumnos");
        }
    }
}
