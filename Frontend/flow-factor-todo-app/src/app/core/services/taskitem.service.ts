import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem } from '../models/taskitem.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root' 
})
export class TaskItemService {

  private apiUrl = environment.apiUrl + '/TaskItems';

  constructor(private http: HttpClient) { } 

  // Get all TaskItems
  getAllTaskItems(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl);
  }
  // Get a TaskItem by ID
  getTaskItemById(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/${id}`);
  }

  patchTask(id: number, patchOps: any[]): Observable<TaskItem> {
    return this.http.patch<TaskItem>(`${this.apiUrl}/${id}`, patchOps);
  }

  // Create a new TaskItem
  createTaskItem(taskItem: TaskItem): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, taskItem);
  }

  // Update an existing TaskItem
  updateTaskItem(id: number, taskItem: TaskItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, taskItem);
  }

  // Delete a TaskItem
  deleteTaskItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
