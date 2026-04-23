using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiAlumnos2026.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCampoFechaNota : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha",
                table: "NotasAlumnos",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_NotasAlumnos_AsignaturaID",
                table: "NotasAlumnos",
                column: "AsignaturaID");

            migrationBuilder.AddForeignKey(
                name: "FK_NotasAlumnos_Asignaturas_AsignaturaID",
                table: "NotasAlumnos",
                column: "AsignaturaID",
                principalTable: "Asignaturas",
                principalColumn: "AsignaturaID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotasAlumnos_Asignaturas_AsignaturaID",
                table: "NotasAlumnos");

            migrationBuilder.DropIndex(
                name: "IX_NotasAlumnos_AsignaturaID",
                table: "NotasAlumnos");

            migrationBuilder.DropColumn(
                name: "Fecha",
                table: "NotasAlumnos");
        }
    }
}
