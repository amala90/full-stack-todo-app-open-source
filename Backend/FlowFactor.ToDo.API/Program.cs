using FlowFactor.ToDo.API.Data;
using FlowFactor.ToDo.API.Services;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Conditionally choose provider
if (builder.Environment.IsEnvironment("Testing"))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("TestDb"));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}

// Register task items service
builder.Services.AddScoped<TaskItemService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();

// Enables JsonPatch support: for PATCH to work
builder.Services.AddControllers()
    .AddNewtonsoftJson();
// Add CORS policy for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        policy => policy
            .WithOrigins("http://localhost:4200", "https://ay-todo-app.azurewebsites.net") // Angular dev server URL
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}
app.UseHttpsRedirection();

app.UseCors("AllowAngularDev");

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }