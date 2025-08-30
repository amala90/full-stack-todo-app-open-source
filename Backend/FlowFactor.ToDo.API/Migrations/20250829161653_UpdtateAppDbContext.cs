using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlowFactor.ToDo.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdtateAppDbContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskItemS",
                table: "TaskItemS");

            migrationBuilder.RenameTable(
                name: "TaskItemS",
                newName: "TaskItems");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskItems",
                table: "TaskItems",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskItems",
                table: "TaskItems");

            migrationBuilder.RenameTable(
                name: "TaskItems",
                newName: "TaskItemS");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskItemS",
                table: "TaskItemS",
                column: "Id");
        }
    }
}
