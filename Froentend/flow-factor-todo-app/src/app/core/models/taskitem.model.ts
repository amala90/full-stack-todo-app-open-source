export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedUser: string;
   createdDate: Date;
}