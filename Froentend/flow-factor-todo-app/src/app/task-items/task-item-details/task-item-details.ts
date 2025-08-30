import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskItem } from '../../core/models/taskitem.model';
import { TaskItemService } from '../../core/services/taskitem.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { TaskStatus } from '../../core/enums/task-status.enum';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-item-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule
  ],
  templateUrl: './task-item-details.html',
  styleUrls: ['./task-item-details.css']
})
export class TaskItemDetails implements OnInit {
  /** Task status enum */
  TaskStatus = TaskStatus;
  /** Task item details */
  task: TaskItem | null = null;
  /** Loading state */
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskItemService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Load the task details
    this.loadTask();
  }

  /**
   * Loads the task details.
   * @returns void
   */
  loadTask(): void {
    // Get the task ID from the route parameters
    const idStr = this.route.snapshot.paramMap.get('id');
    // Convert the ID to a number
    const taskId = Number(idStr);
    // Check if the ID is valid
    if (!taskId) {
      // Navigate back to the task list
      this.loading = false;
      // fallback if error
      this.router.navigate(['/tasks']);
      return;
    }

    // Fetch the task details
    this.taskService.getTaskItemById(taskId).subscribe({
      next: (task) => {
        // Successfully fetched task
        this.task = task;
        // Update loading state
        this.loading = false;
      },
      error: (err) => {
        // Handle error
        console.error('Error fetching task:', err);
        // Navigate back to the task list
        this.loading = false;   
        // fallback if error     
        this.router.navigate(['/tasks']); 
      }
    });
  }

  /**
   * Navigate back to the task list.
   */
  goBack(): void {
    // Navigate back to the task list
    this.router.navigate(['/tasks']);
  }

  /**
   * Gets the color for the task status.
   * @param status The status of the task.
   * @returns The color for the status.
   */
  getStatusColor(status?: string): 'primary' | 'accent' | 'warn' | undefined {
    // Get the color for the status.
    if (!status) return undefined;
    const s = status.toLowerCase();
    if (s.includes('complete')) return 'primary';
    if (s.includes('progress') || s.includes('in progress')) return 'accent';
    if (s.includes('blocked') || s.includes('failed')) return 'warn';
    return undefined;
  }

  /**
   * Edits an existing task.
   * @param id The ID of the task to edit.
   */
  editTask(id: number): void {
    this.router.navigate(['/tasks/update', id]);
  }

  /**
   * Deletes a task.
   * @param id The ID of the task to delete.
   */
  deleteTask(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTaskItem(id).subscribe({
        next: () => this.loadTask(),
        error: (err) => console.error('Error deleting task:', err)
      });
    }
  }

  /**
   * Toggles the status of the task between 'Completed' and 'Pending'.
   * @param task The task item to toggle status for.
   */
  toggleCompletion(task: TaskItem): void {
    const updatedStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    const updatedTask = { ...task, status: updatedStatus };
  }

  /**
   * Toggles the status of the task between 'Completed' and 'Pending'.
   * @param task The task item to toggle status for.
   */
  changeStatus(status: TaskStatus): void {
    if (!this.task) return;
    // JSON Patch document: replace the "status" field
    const patchDoc = [
      { op: 'replace', path: '/Status', value: status }
    ];

    // Send the patch request to update the task status
    this.taskService.patchTask(this.task.id, patchDoc).subscribe({
      next: (updatedTask) => {
        // Show success message
        this.snackbar.open('Statut mis à jour avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
        // Update local task status
        this.loadTask();
      },
      error: (err) => {
        // Show error message
        console.error('Error updating task:', err);
        // Show snackbar notification
        this.snackbar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }
}
