using System.Threading.Tasks;
using FlowFactor.ToDo.API.Data;
using FlowFactor.ToDo.API.Entities;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;

namespace FlowFactor.ToDo.API.Services
{
    /// <summary>
    /// Service class responsible for handling business logic 
    /// related to TaskItem entities.
    /// </summary>
    public class TaskItemService
    {
        private readonly AppDbContext _context;

        public TaskItemService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all TaskItems from the database.
        /// </summary>
        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            // Get the list of tasks, oredered by date
            var tasks = await _context.TaskItems
                                        .OrderByDescending(t => t.CreatedDate)
                                        .ToListAsync();

            // Convert all CreatedDate fields to local time
            foreach (var task in tasks)
            {
                task.CreatedDate = task.CreatedDate.ToLocalTime();
            }

            return tasks;
        }

        /// <summary>
        /// Retrieves a TaskItem by its unique identifier.
        /// </summary>
        /// <param name="id">TaskItem Id</param>
        public async Task<TaskItem?> GetTaskByIdAsync(int id)
        {
            // Fetch task by id
            var task = await _context.TaskItems.FindAsync(id);

            // Convert date time to local time
            if (task != null)
            {
                task.CreatedDate = task.CreatedDate.ToLocalTime();
            }

            return task;
        }

        /// <summary>
        /// Creates a new TaskItem and saves it to the database.
        /// </summary>
        /// <param name="taskItem">New TaskItem to add</param>
        public async Task<TaskItem> CreateTaskAsync(TaskItem taskItem)
        {
            // Add the task item to the database
            _context.TaskItems.Add(taskItem);
            // Save the changes to the database
            await _context.SaveChangesAsync();
            return taskItem;
        }

        /// <summary>
        /// Updates a TaskItem completely by replacing its values.
        /// </summary>
        /// <param name="id">TaskItem Id</param>
        /// <param name="taskItem">Updated TaskItem</param>
        public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem taskItem)
        {
            var existingTask = await _context.TaskItems.FindAsync(id);
            if (existingTask == null) return null;

            existingTask.Title = taskItem.Title;
            existingTask.Description = taskItem.Description;
            existingTask.Status = taskItem.Status;
            existingTask.AssignedUser = taskItem.AssignedUser;

            await _context.SaveChangesAsync();
            return existingTask;
        }

        /// <summary>
        /// Applies a JSON Patch to partially update a TaskItem.
        /// </summary>
        /// <param name="id">TaskItem Id</param>
        /// <param name="patchDoc">Patch document describing changes</param>
        public async Task<TaskItem?> PatchTaskAsync(int id, JsonPatchDocument<TaskItem> patchDoc)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null) return null;

            // Apply patch operations (e.g., replace, add, remove)
            patchDoc.ApplyTo(taskItem);

            await _context.SaveChangesAsync();
            return taskItem;
        }

        /// <summary>
        /// Deletes a TaskItem by its Id.
        /// </summary>
        /// <param name="id">TaskItem Id</param>
        public async Task<bool> DeleteTaskAsync(int id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null) return false;

            _context.TaskItems.Remove(taskItem);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
