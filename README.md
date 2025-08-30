# Flow Factor To-Do App

This project is a full-stack To-Do application with a **.NET Core API backend** and an **Angular frontend**. It allows users to manage tasks efficiently with features like CRUD operations, task filtering, and sorting.

## Project Structure

```

Root/
├─ Backend/                 # .NET Core API and Tests
│  ├─ FlowFactor.ToDo.API/          # API project
│  └─ FlowFactor.ToDo.API.Tests/    # Unit and Integration tests
│
└─ Frontend/                # Angular frontend
   └─ flow-factor-todo-app/ # Angular project

````

## Backend

### Overview
The backend is built using **ASP.NET Core** with **Entity Framework Core** for data access. It provides a RESTful API for managing tasks.

### Features
- CRUD operations for tasks
- Task filtering and sorting
- Integration and unit tests to ensure reliability

### Getting Started
1. Navigate to the backend folder:
```bash
   cd Backend/FlowFactor.ToDo.API
```

2. Restore dependencies:

   ```bash
   dotnet restore
   ```
3. Run the API:

   ```bash
   dotnet run
   ```
4. Run tests:

   ```bash
   cd ../FlowFactor.ToDo.API.Tests
   dotnet test
   ```

### Technologies

* ASP.NET Core
* Entity Framework Core
* xUnit / Integration Tests

---

## Frontend

### Overview

The frontend is an **Angular** application that communicates with the backend API to display and manage tasks.

### Getting Started

1. Navigate to the frontend folder:

   ```bash
   cd Frontend/flow-factor-todo-app
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Run the Angular development server:

   ```bash
   ng serve
   ```
4. Open your browser at `http://localhost:4200`

### Features

* View tasks list
* Add, update, and delete tasks
* Filter and sort tasks
* Responsive UI

### Technologies

* Angular
* RxJS
* Angular Material (optional if used)

---

## Contributing

1. Fork the repository
2. Create your feature branch:

   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add YourFeature"
   ```
4. Push to the branch:

   ```bash
   git push origin feature/YourFeature
   ```