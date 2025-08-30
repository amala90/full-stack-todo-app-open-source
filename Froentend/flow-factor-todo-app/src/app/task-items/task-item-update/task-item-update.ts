import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TaskItem } from '../../core/models/taskitem.model';
import { TaskItemService } from '../../core/services/taskitem.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TaskStatus } from '../../core/enums/task-status.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-item-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './task-item-update.html',
  styleUrls: ['./task-item-update.css']
})
export class TaskItemUpdate implements OnInit {
  /** Task statuses */
  TaskStatus = TaskStatus;
  /** Task form group */
  taskForm!: FormGroup;
  /** Task ID */
  taskId!: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskItemService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize the task form
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      assignedUser: ['', Validators.required],
       createdDate: [new Date(), Validators.required]
    });

    // Get the task ID from the route parameters
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    // Load the task details
    this.loadTask();
  }

  loadTask(): void {
    if (!this.taskId) {
      console.error('Invalid task ID');
      return;
    }

    // Since your service only provides getAllTaskItems, we filter by ID
    this.taskService.getTaskItemById(this.taskId)
      .subscribe({
        next: (task) => {
          // Successfully loaded task
          if (task) {
            // Patch the form with the task details
            this.taskForm.patchValue(task);
          } else {
            // Task not found
            console.error('Task not found');
          }
        },
        error: (err) => console.error('Error loading task:', err)
      });
  }

  /**
   * Handles form submission.
   */
  onSubmit(): void {
    // Check if the form is valid
    if (this.taskForm.valid) {
      // Create the updated task object
      const updatedTask: TaskItem = { id: this.taskId, ...this.taskForm.value };
      // Call the service to update the task
      this.taskService.updateTaskItem(this.taskId, updatedTask).subscribe({
        next: () => {
          // Show success message
          this.snackBar.open('Tâche mise à jour avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
          // Navigate back to the task list
          this.router.navigate(['/tasks']);
        },
        error: (err) =>{
          // Show error message
          this.snackBar.open('Erreur lors de la mise à jour de la tâche', 'Fermer', { duration: 3000, verticalPosition: 'top' });
          // Log the error
          console.error('Error updating task:', err);
        }
      });
    }
  }

  /**
   * Navigate back to the task list
   */
  goBack(): void {
    // Navigate back to the task list
    this.router.navigate(['/tasks']);
  }
}
