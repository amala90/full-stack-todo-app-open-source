using System;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FlowFactor.ToDo.API.Entities;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using ToDoListApi;
using Xunit;

namespace ToDoListApi.Tests.Integration
{
    /// <summary>
    /// Integration tests for TaskItemsController API endpoints.
    /// These tests verify the behavior of the API using a real HTTP client
    /// and an in-memory database.
    /// </summary>
    public class TaskItemsControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;


        public TaskItemsControllerTests()
        {
            var factory = new CustomWebApplicationFactory();
            _client = factory.CreateClient();
        }

        /// <summary>
        /// Tests creating a new TaskItem via POST /api/taskitems.
        /// </summary>
        [Fact]
        public async Task CreateTaskItem_ShouldReturnCreatedItem()
        {
            // Arrange
            var newTask = new TaskItem
            {
                Title = "Test Task",
                Description = "Integration test task",
                Status = "To Do",
                AssignedUser = "Dr. Smith",
                CreatedDate = DateTime.UtcNow
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/taskitems", newTask);
            var createdTask = await response.Content.ReadFromJsonAsync<TaskItem>();

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            Assert.NotNull(createdTask);
            Assert.Equal("Test Task", createdTask.Title);
            Assert.Equal("Dr. Smith", createdTask.AssignedUser);
        }

        /// <summary>
        /// Tests retrieving all task items via GET /api/taskitems.
        /// </summary>
        [Fact]
        public async Task GetTaskItems_ShouldReturnOkWithList()
        {
            // Arrange
            var response1 = await _client.PostAsJsonAsync("/api/taskitems", new TaskItem
            {
                Title = "Task One",
                Description = "First",
                Status = "To Do",
                AssignedUser = "Alice",
                CreatedDate = DateTime.UtcNow
            });

            var response2 = await _client.PostAsJsonAsync("/api/taskitems", new TaskItem
            {
                Title = "Task Two",
                Description = "Second",
                Status = "In Progress",
                AssignedUser = "Bob",
                CreatedDate = DateTime.UtcNow
            });

            // Act
            var response = await _client.GetAsync("/api/taskitems");
            var tasks = await response.Content.ReadFromJsonAsync<List<TaskItem>>();

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.NotNull(tasks);
            Assert.True(tasks.Count >= 2);
        }

        /// <summary>
        /// Tests retrieving a specific task by ID via GET /api/taskitems/{id}.
        /// </summary>
        [Fact]
        public async Task GetTaskItem_ShouldReturnTask_WhenExists()
        {
            // Arrange
            var postResponse = await _client.PostAsJsonAsync("/api/taskitems", new TaskItem
            {
                Title = "Find Me",
                Description = "Should be retrievable",
                Status = "Done",
                AssignedUser = "Charlie",
                CreatedDate = DateTime.UtcNow
            });
            var createdTask = await postResponse.Content.ReadFromJsonAsync<TaskItem>();

            // Act
            var response = await _client.GetAsync($"/api/taskitems/{createdTask.Id}");
            var task = await response.Content.ReadFromJsonAsync<TaskItem>();

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.NotNull(task);
            Assert.Equal("Find Me", task.Title);
        }

        /// <summary>
        /// Tests updating an existing task via PUT /api/taskitems/{id}.
        /// </summary>
        [Fact]
        public async Task UpdateTaskItem_ShouldReturnNoContent()
        {
            // Arrange
            var postResponse = await _client.PostAsJsonAsync("/api/taskitems", new TaskItem
            {
                Title = "Old Title",
                Description = "Update me",
                Status = "To Do",
                AssignedUser = "Dana",
                CreatedDate = DateTime.UtcNow
            });
            var createdTask = await postResponse.Content.ReadFromJsonAsync<TaskItem>();
            createdTask.Title = "Updated Title";

            // Act
            var response = await _client.PutAsJsonAsync($"/api/taskitems/{createdTask.Id}", createdTask);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            // Verify update
            var getResponse = await _client.GetAsync($"/api/taskitems/{createdTask.Id}");
            var updatedTask = await getResponse.Content.ReadFromJsonAsync<TaskItem>();
            Assert.Equal("Updated Title", updatedTask.Title);
        }

        /// <summary>
        /// Tests deleting an existing task via DELETE /api/taskitems/{id}.
        /// </summary>
        [Fact]
        public async Task DeleteTaskItem_ShouldReturnNoContent()
        {
            // Arrange
            var postResponse = await _client.PostAsJsonAsync("/api/taskitems", new TaskItem
            {
                Title = "Delete Me",
                Description = "To be deleted",
                Status = "To Do",
                AssignedUser = "Eve",
                CreatedDate = DateTime.UtcNow
            });
            var createdTask = await postResponse.Content.ReadFromJsonAsync<TaskItem>();

            // Act
            var response = await _client.DeleteAsync($"/api/taskitems/{createdTask.Id}");

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            // Verify deletion
            var getResponse = await _client.GetAsync($"/api/taskitems/{createdTask.Id}");
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }
    }
}
