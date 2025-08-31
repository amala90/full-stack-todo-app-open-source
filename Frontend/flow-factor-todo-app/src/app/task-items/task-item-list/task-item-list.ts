import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TaskItem } from '../../core/models/taskitem.model';
import { TaskItemService } from '../../core/services/taskitem.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TaskStatus } from '../../core/enums/task-status.enum';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-task-item-list',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule, 
    RouterModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-item-list.html',
  styleUrls: ['./task-item-list.css']
})
export class TaskItemList implements OnInit {
  /** Task items */
  tasks: TaskItem[] = [];
  /** Paged task items */
  pagedTasks: TaskItem[] = [];

  /** Task statuses */
  TaskStatus = TaskStatus;
  // Paginator state
  pageSize = 5;
  pageIndex = 0;
  length = 0;

  /** Loading state */
  isLoading = false;

  constructor(
    private taskService: TaskItemService, 
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Loads all tasks from the server.
   */
  loadTasks(): void {
    this.isLoading = true;
    // Fetch all tasks from the service
    this.taskService.getAllTaskItems().subscribe({
      next: (data) => {
        // Update tasks
        this.tasks = data;
        // Update paginator length
        this.length = data.length;
        // Update tasks and paginator length
        this.updatePagedTasks();
        // Stop the loading indicator
        this.isLoading = false;
      },
      error: (err) =>{
        // Stop loading indicator
        this.isLoading = false;
        // Show error message
        console.error('Error loading tasks:', err);
      }
    });
  }

  /**
   * Updates the paged tasks based on the current pagination state.
   */
  updatePagedTasks(): void {
    // Calculate the start and end indices for the current page
    const start = this.pageIndex * this.pageSize;
    // Slice the tasks array to get the tasks for the current page
    this.pagedTasks = this.tasks.slice(start, start + this.pageSize);
  }

  /**
   * Handles changes to the pagination state.
   * @param event The pagination event.
   */
  onPageChange(event: PageEvent): void {
    // Update paginator state
    this.pageSize = event.pageSize;
    // Update page index
    this.pageIndex = event.pageIndex;
    // Update paged tasks
    this.updatePagedTasks();
  }

  /**
   * Creates a new task.
   */
  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }

  /**
   * Edits an existing task.
   * @param id The ID of the task to edit.
   */
  editTask(id: number): void {
    this.router.navigate(['/tasks/update', id]);
  }

  /**
   * Navigates to the task details page.
   * @param id The ID of the task to view.
   */
  detailsTask(id: number): void {
    this.router.navigate([`/tasks/details/${id}`]);
  }

  /**
   * Deletes a task.
   * @param id The ID of the task to delete.
   */
  deleteTask(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTaskItem(id).subscribe({
        next: () => {
          // Show success message
          this.snackbar.open('Tâche supprimée avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
          // Reload tasks
          this.loadTasks();
        },
        error: (err) => {
          // Show error message
          console.error('Error deleting task:', err);
          // Show snackbar notification
          this.snackbar.open('Erreur lors de la suppression de la tâche', 'Fermer', { duration: 3000, verticalPosition: 'top' });
        }
      });
    }
  }

  /**
   * Toggles the status of the task between 'Completed' and 'Pending'.
   * @param task The task item to toggle status for.
   */
  changeStatus(task: TaskItem, status: TaskStatus): void {
    // JSON Patch document: replace the "status" field
    const patchDoc = [
      { op: 'replace', path: '/Status', value: status }
    ];

    // Send the patch request to update the task status
    this.taskService.patchTask(task.id, patchDoc).subscribe({
      next: (updatedTask) => {
        // Show success message
        this.snackbar.open('Statut mis à jour avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
        // Update local task status
        task.status = updatedTask.status; // update local UI
      },
      error: (err) => {
        // Show error message        
        console.error('Error updating task:', err);
        // Show snackbar notification
        this.snackbar.open('Erreur lors de la mise à jour de la tâche', 'Fermer', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }
}
