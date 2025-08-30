using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FlowFactor.ToDo.API.Data;
using FlowFactor.ToDo.API.Entities;
using FlowFactor.ToDo.API.Services;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;

namespace ToDoListApi.Tests.Unit
{
    /// <summary>
    /// Unit tests for the TaskItemService class.
    /// Ensures CRUD and patch operations on TaskItem entities behave as expected.
    /// </summary>
    public class TaskItemServiceTests
    {
        private DbContextOptions<AppDbContext> GetInMemoryDbOptions()
        {
            return new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Unique in-memory DB for each test
                .Options;
        }

        /// <summary>
        /// Tests that CreateTaskItemAsync correctly saves a new TaskItem.
        /// </summary>
        [Fact]
        public async Task CreateTaskItemAsync_Should_Add_TaskItem()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            var taskItem = new TaskItem
            {
                Title = "Test Task",
                Description = "Test Description",
                Status = "to do",
                AssignedUser = "Dr. Brown",
                CreatedDate = DateTime.UtcNow
            };

            using var context = new AppDbContext(options);
            var service = new TaskItemService(context);

            // Act
            var result = await service.CreateTaskAsync(taskItem);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Task", result.Title);
            Assert.Equal("Dr. Brown", result.AssignedUser);
        }

        /// <summary>
        /// Tests that GetTaskItemByIdAsync returns the correct TaskItem when it exists.
        /// </summary>
        [Fact]
        public async Task GetTaskItemByIdAsync_Should_Return_TaskItem()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var taskItem = new TaskItem
            {
                Title = "Sample Task",
                Description = "Some description",
                Status = "in progress",
                AssignedUser = "Nurse Kelly",
                CreatedDate = DateTime.UtcNow
            };
            context.TaskItems.Add(taskItem);
            await context.SaveChangesAsync();

            var service = new TaskItemService(context);

            // Act
            var result = await service.GetTaskByIdAsync(taskItem.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Sample Task", result.Title);
            Assert.Equal("Nurse Kelly", result.AssignedUser);
        }

        /// <summary>
        /// Tests that UpdateTaskItemAsync modifies an existing TaskItem.
        /// </summary>
        [Fact]
        public async Task UpdateTaskItemAsync_Should_Update_TaskItem()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var taskItem = new TaskItem
            {
                Title = "Old Task",
                Description = "Old Description",
                Status = "to do",
                AssignedUser = "Dr. Adams",
                CreatedDate = DateTime.UtcNow
            };
            context.TaskItems.Add(taskItem);
            await context.SaveChangesAsync();

            var service = new TaskItemService(context);

            var updatedTask = new TaskItem
            {
                Id = taskItem.Id,
                Title = "Updated Task",
                Description = "Updated Description",
                Status = "done",
                AssignedUser = "Dr. Adams", // Keep same AssignedUser
                CreatedDate = taskItem.CreatedDate
            };

            // Act
            var result = await service.UpdateTaskAsync(taskItem.Id, updatedTask);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Task", result.Title);
            Assert.Equal("done", result.Status);
            Assert.Equal("Dr. Adams", result.AssignedUser);
        }

        /// <summary>
        /// Tests that DeleteTaskItemAsync removes the TaskItem from the database.
        /// </summary>
        [Fact]
        public async Task DeleteTaskItemAsync_Should_Remove_TaskItem()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var taskItem = new TaskItem
            {
                Title = "Task to Delete",
                Description = "Delete this task",
                Status = "to do",
                AssignedUser = "Dr. Green",
                CreatedDate = DateTime.UtcNow
            };
            context.TaskItems.Add(taskItem);
            await context.SaveChangesAsync();

            var service = new TaskItemService(context);

            // Act
            var result = await service.DeleteTaskAsync(taskItem.Id);

            // Assert
            Assert.True(result);
            Assert.Null(await context.TaskItems.FindAsync(taskItem.Id));
        }

        /// <summary>
        /// Tests that PatchTaskItemAsync successfully updates the Status field.
        /// </summary>
        [Fact]
        public async Task PatchTaskAsync_UpdatesTask()
        {
            // ----------------- Arrange -----------------
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var task = new TaskItem { Title = "Task", Description = "Desc", Status = "ToDo", CreatedDate = DateTime.UtcNow, AssignedUser = "John Doe" };
            context.TaskItems.Add(task);
            await context.SaveChangesAsync();

            var service = new TaskItemService(context);

            var patchDoc = new JsonPatchDocument<TaskItem>();
            patchDoc.Replace(t => t.Status, "Done");

            // ----------------- Act -----------------
            var result = await service.PatchTaskAsync(task.Id, patchDoc);

            // ----------------- Assert -----------------
            Assert.NotNull(result);
            Assert.Equal("Done", result.Status);
        }
    }
}
