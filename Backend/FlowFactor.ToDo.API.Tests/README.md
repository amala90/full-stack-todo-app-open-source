# To Do List API Tests

This project contains **unit and integration tests** for the ToDoList API backend. It ensures the API and service logic work correctly and reliably.

**Built by: Amal Yousfi**

## Project Structure

- **Integration Tests**
  - `TaskItemsControllerTests` – Tests API endpoints using a real HTTP client and in-memory database.
  - `CustomWebApplicationFactory` – Configures a test environment for integration tests.
- **Unit Tests**
  - `TaskItemServiceTests` – Tests the business logic of `TaskItemService` using an in-memory database.

## Test Coverage

### Integration Tests
- Creating a new task (`POST /api/taskitems`)
- Retrieving all tasks (`GET /api/taskitems`)
- Retrieving a task by ID (`GET /api/taskitems/{id}`)
- Updating a task (`PUT /api/taskitems/{id}`)
- Deleting a task (`DELETE /api/taskitems/{id}`)

### Unit Tests
- Creating a task in `TaskItemService`
- Getting a task by ID
- Updating a task
- Deleting a task
- Partially updating a task using JSON Patch

## Running the Tests

1. Open the test project in **Visual Studio** or **VS Code**.
2. Restore dependencies:

```bash
dotnet restore
````

3. Run **all tests**:

```bash
dotnet test
```

4. Alternatively, run **specific tests** in your IDE's Test Explorer.

## Notes

* Integration tests use an in-memory database to avoid modifying real data.
* Unit tests ensure the `TaskItemService` methods behave as expected for all CRUD operations.
* These tests help maintain API reliability and prevent regressions.

## Additional Resources

* [xUnit Documentation](https://xunit.net/)
* [ASP.NET Core Integration Testing](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests)
* [Entity Framework Core In-Memory Database](https://docs.microsoft.com/en-us/ef/core/providers/in-memory/)