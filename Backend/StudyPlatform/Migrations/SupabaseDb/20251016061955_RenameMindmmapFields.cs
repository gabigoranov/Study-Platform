using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPlatform.Migrations.SupabaseDb
{
    /// <inheritdoc />
    public partial class RenameMindmmapFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SubgroupId",
                table: "Mindmaps",
                newName: "SubjectId");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "Mindmaps",
                newName: "MaterialSubGroupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SubjectId",
                table: "Mindmaps",
                newName: "SubgroupId");

            migrationBuilder.RenameColumn(
                name: "MaterialSubGroupId",
                table: "Mindmaps",
                newName: "GroupId");
        }
    }
}
