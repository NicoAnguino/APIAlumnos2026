using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiAlumnos2026.Migrations
{
    /// <inheritdoc />
    public partial class AplicarRelacionAlumnoNotaAlumno : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DNI",
                table: "NotasAlumnos");

            migrationBuilder.DropColumn(
                name: "NombreCompleto",
                table: "NotasAlumnos");

            migrationBuilder.CreateIndex(
                name: "IX_NotasAlumnos_AlumnoID",
                table: "NotasAlumnos",
                column: "AlumnoID");

            migrationBuilder.AddForeignKey(
                name: "FK_NotasAlumnos_Alumnos_AlumnoID",
                table: "NotasAlumnos",
                column: "AlumnoID",
                principalTable: "Alumnos",
                principalColumn: "AlumnoID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotasAlumnos_Alumnos_AlumnoID",
                table: "NotasAlumnos");

            migrationBuilder.DropIndex(
                name: "IX_NotasAlumnos_AlumnoID",
                table: "NotasAlumnos");

            migrationBuilder.AddColumn<int>(
                name: "DNI",
                table: "NotasAlumnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "NombreCompleto",
                table: "NotasAlumnos",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
