
using FlowFactor.ToDo.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace FlowFactor.ToDo.API.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<TaskItem> TaskItems { get; set; }


    }
}
