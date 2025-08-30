# To Do List API

This is the backend API for managing tasks, built using **ASP.NET Core** with Entity Framework Core for database access.

**Built by: Amal Yousfi**

## Project Structure

- **Controllers**
  - `TaskItemsController` – Handles HTTP requests for CRUD operations and JSON Patch updates.
- **Services**
  - `TaskItemService` – Contains business logic for managing tasks.
- **Models**
  - `TaskItem` – Represents a task with `Id`, `Title`, `Description`, `Status`, `AssignedUser`, and `CreatedDate`.
- **Data**
  - `AppDbContext` – Entity Framework DbContext for TaskItems.

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/taskitems` | Get all tasks |
| GET | `/api/taskitems/{id}` | Get task by ID |
| POST | `/api/taskitems` | Create a new task |
| PUT | `/api/taskitems/{id}` | Update a task completely |
| PATCH | `/api/taskitems/{id}` | Partially update a task using JSON Patch |
| DELETE | `/api/taskitems/{id}` | Delete a task |

## Features

- CRUD operations for tasks.
- Partial updates using JSON Patch (`PATCH` method).
- Task creation and update timestamps converted to local time.
- Validation and error handling for non-existent tasks.

## Running the API

1. Ensure you have **.NET 8 SDK** installed.
2. Open the project in your preferred IDE (Visual Studio or VS Code).
3. Restore dependencies:

```bash
dotnet restore
````

4. Run the API:

```bash
dotnet run
```

5. The API will be available at `https://localhost:5001` or `http://localhost:5000`.

## Testing

Unit tests can be added for the service and controller classes using **xUnit** or **NUnit**. Typical tests include:

* **TaskItemService**

  * Create, read, update, delete tasks.
  * JSON Patch partial updates.
  * Handling non-existent IDs.
* **TaskItemsController**

  * Verify proper HTTP responses (200, 201, 404, 400).
  * Integration with TaskItemService.
  * Patch and delete endpoints behavior.

## Additional Resources

* [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
* [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
* [JSON Patch in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/web-api/jsonpatch)