import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskItem } from '../../core/models/taskitem.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TaskItemService } from '../../core/services/taskitem.service';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskStatus } from '../../core/enums/task-status.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-task-item-create',
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
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './task-item-create.html',
  styleUrl: './task-item-create.css'
})
export class TaskItemCreate implements OnInit {
  /** Task statuses */
  TaskStatus = TaskStatus;
  /** Task form group */
  taskForm!: FormGroup;
  /** Task list */
  tasks: TaskItem[] = [];
  /** Usernames */
  usernames: string[] = [];
  /** Filtered options */
  filteredOptions: Observable<string[]> | undefined;

  now = new Date();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskItemService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Initialize the task form
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [TaskStatus.Pending, Validators.required],
      assignedUser: ['', Validators.required],
      createdDate: [new Date(), Validators.required]
    });

    // Load existing tasks
    this.loadTasks();

    // Initialize filtered options for assigned user
    // Listen to changes in the assigned user field and filter the options
    this.filteredOptions = this.taskForm.get('assignedUser')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  loadTasks(): void {
    // Call the service to get the tasks
    this.taskService.getAllTaskItems().subscribe({
      next: (tasks) => {
        // Handle the retrieved tasks
        this.tasks = tasks;
        // Extract usernames
        this.usernames = this.tasks.map(t => t.assignedUser);
      },
      error: (err) => {
        // Log the error
        console.error('Error loading tasks:', err);
      }
    });
  }

  /**
   * Handles form submission.
   */
  onSubmit(): void {
    // Check if the form is valid
    if (this.taskForm.valid) {
      // Create a new task object
      const newTask: TaskItem = {
        id: 0,
        ...this.taskForm.value,
        createdDate: new Date().toLocaleString()
      };

      console.log('New Task:', newTask);

      // Call the service to create the task
      this.taskService.createTaskItem(newTask).subscribe({
        next: (createdTask) => {
          // Show success message
          this.snackbar.open('Tâche créée avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
          // Reset the form
          this.taskForm.reset();
          //  redirect to the task list
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          // Show error message
          this.snackbar.open('Erreur lors de la création de la tâche', 'Fermer', { duration: 3000, verticalPosition: 'top' });
          // Log the error
          console.error('Error creating task:', err);
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.usernames.filter(option => option.toLowerCase().includes(filterValue));
  }
}
