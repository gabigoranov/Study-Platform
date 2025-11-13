using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPlatform.Migrations.SupabaseDb
{
    /// <inheritdoc />
    public partial class AddAppUserFriendsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUsersFriends",
                columns: table => new
                {
                    RequesterId = table.Column<Guid>(type: "uuid", nullable: false),
                    AddresseeId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsAccepted = table.Column<bool>(type: "boolean", nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsersFriends", x => new { x.RequesterId, x.AddresseeId });
                    table.ForeignKey(
                        name: "FK_AppUsersFriends_app_users_AddresseeId",
                        column: x => x.AddresseeId,
                        principalSchema: "public",
                        principalTable: "app_users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_AppUsersFriends_app_users_RequesterId",
                        column: x => x.RequesterId,
                        principalSchema: "public",
                        principalTable: "app_users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUsersFriends_AddresseeId",
                table: "AppUsersFriends",
                column: "AddresseeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUsersFriends");
        }
    }
}
