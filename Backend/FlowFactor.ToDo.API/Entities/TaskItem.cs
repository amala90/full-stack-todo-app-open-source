namespace FlowFactor.ToDo.API.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } 
        public string Description { get; set; } 
        public string Status { get; set; } 
        public string AssignedUser { get; set; }
        public DateTime CreatedDate { get; set; } 
    }
}
