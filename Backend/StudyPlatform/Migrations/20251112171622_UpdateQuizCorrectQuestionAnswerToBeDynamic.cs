using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPlatform.Migrations.SupabaseDb
{
    /// <inheritdoc />
    public partial class UpdateQuizCorrectQuestionAnswerToBeDynamic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizQuestions_QuizQuestionAnswers_CorrectQuizQuestionAnswer~",
                table: "QuizQuestions");

            migrationBuilder.DropIndex(
                name: "IX_QuizQuestions_CorrectQuizQuestionAnswerId",
                table: "QuizQuestions");

            migrationBuilder.DropColumn(
                name: "CorrectQuizQuestionAnswerId",
                table: "QuizQuestions");

            migrationBuilder.AddColumn<bool>(
                name: "IsCorrect",
                table: "QuizQuestionAnswers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCorrect",
                table: "QuizQuestionAnswers");

            migrationBuilder.AddColumn<Guid>(
                name: "CorrectQuizQuestionAnswerId",
                table: "QuizQuestions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestions_CorrectQuizQuestionAnswerId",
                table: "QuizQuestions",
                column: "CorrectQuizQuestionAnswerId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_QuizQuestions_QuizQuestionAnswers_CorrectQuizQuestionAnswer~",
                table: "QuizQuestions",
                column: "CorrectQuizQuestionAnswerId",
                principalTable: "QuizQuestionAnswers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
