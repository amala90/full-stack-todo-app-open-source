# To Do List App

This project is a simple task management application built with **Angular 20**, using **Angular Material** and **Bootstrap** for UI styling and responsiveness.

**Built by: Amal Yousfi**

## Components

The app includes the following main components:

- **TaskItemCreate** – Create new tasks with title, description, status, assigned user, and date.
- **TaskItemUpdate** – Update existing tasks with validation and feedback.
- **TaskItemDetails** – View detailed information of a task, including status, assigned user, and actions.
- **TaskItemList** – Display all tasks in a paginated table with options to edit, delete, or change status.

## UI and Styling

- **Angular Material** – Provides components like buttons, forms, cards, datepickers, tables, snackbars, and icons.
- **Bootstrap** – Used for layout, grid system, and responsive design.
- **Custom CSS** – Additional styling for components to enhance usability.

## Development Server

Run the following command to start a local server:

```bash
ng serve
````

Navigate to `http://localhost:4200/` in your browser. The app automatically reloads when you modify source files.

## Code Scaffolding

Generate new components, directives, or pipes:

```bash
ng generate component component-name
```

List all available schematics:

```bash
ng generate --help
```

## Building the Project

Compile the project and store build artifacts in `dist/`:

```bash
ng build
```

## Running Unit Tests

Execute unit tests using Karma:

```bash
ng test
```

### Tests Covered

The tests include:

* **Component creation** – Ensures each component initializes correctly.
* **Form initialization and validation** – Checks forms in `TaskItemCreate` and `TaskItemUpdate`.
* **Task operations** – Create, update, delete, and change status functionalities.
* **Navigation** – Routes for creating, editing, and viewing task details.
* **Pagination** – Validates task listing with correct paging.
* **Error handling** – Simulates service errors and verifies proper notifications using `MatSnackBar`.

## Additional Resources

* [Angular CLI Overview](https://angular.dev/tools/cli)
* [Angular Material](https://material.angular.io/)
* [Bootstrap](https://getbootstrap.com/)