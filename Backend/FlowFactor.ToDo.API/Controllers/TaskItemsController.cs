using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using FlowFactor.ToDo.API.Entities;
using FlowFactor.ToDo.API.Services;

namespace FlowFactor.ToDo.API.Controllers
{
    /// <summary>
    /// API Controller for managing TaskItems (CRUD + Patch).
    /// Delegates logic to TaskItemService for maintainability.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemsController : ControllerBase
    {
        private readonly TaskItemService _taskItemService;

        public TaskItemsController(TaskItemService taskItemService)
        {
            _taskItemService = taskItemService;
        }

        /// <summary>
        /// Gets all TaskItems.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            var tasks = await _taskItemService.GetAllTasksAsync();
            return Ok(tasks);
        }

        /// <summary>
        /// Gets a specific TaskItem by Id.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            var task = await _taskItemService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        /// <summary>
        /// Creates a new TaskItem.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem taskItem)
        {
            TaskItem createdTask = await _taskItemService.CreateTaskAsync(taskItem);
            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }

        /// <summary>
        /// Updates a TaskItem completely (PUT).
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<TaskItem>> UpdateTask(int id, TaskItem taskItem)
        {
            var updatedTask = await _taskItemService.UpdateTaskAsync(id, taskItem);
            if (updatedTask == null) return NotFound();
            return Ok(updatedTask);
        }

        /// <summary>
        /// Partially updates a TaskItem using JSON Patch.
        /// </summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult<TaskItem>> PatchTask(
            int id,
            [FromBody] JsonPatchDocument<TaskItem> patchDoc)
        {
            if (patchDoc == null) return BadRequest("Invalid patch document.");

            var updatedTask = await _taskItemService.PatchTaskAsync(id, patchDoc);
            if (updatedTask == null) return NotFound();

            return Ok(updatedTask);
        }

        /// <summary>
        /// Deletes a TaskItem by Id.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var deleted = await _taskItemService.DeleteTaskAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
