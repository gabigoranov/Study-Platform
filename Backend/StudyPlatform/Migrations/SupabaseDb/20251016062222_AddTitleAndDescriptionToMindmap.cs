using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPlatform.Migrations.SupabaseDb
{
    /// <inheritdoc />
    public partial class AddTitleAndDescriptionToMindmap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Mindmaps",
                type: "character varying(400)",
                maxLength: 400,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Mindmaps",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Mindmaps");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Mindmaps");
        }
    }
}
