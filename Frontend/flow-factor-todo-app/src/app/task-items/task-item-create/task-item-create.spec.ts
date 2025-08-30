import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskItemCreate } from './task-item-create';
import { TaskItemService } from '../../core/services/taskitem.service';
import { TaskStatus } from '../../core/enums/task-status.enum';
import { TaskItem } from '../../core/models/taskitem.model';

/**
 * Unit tests for the TaskItemCreate component.
 * Tests cover initialization, form validation, task loading,
 * filtering logic, task submission, error handling, and navigation.
 */
describe('TaskItemCreate', () => {
  let component: TaskItemCreate;
  let fixture: ComponentFixture<TaskItemCreate>;
  let mockTaskService: jasmine.SpyObj<TaskItemService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  /**
   * Setup mocks and configure the testing module before each test.
   */
  beforeEach(async () => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskItemService', ['getAllTaskItems', 'createTaskItem']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    
    // Default mock behavior for getAllTaskItems
    mockTaskService.getAllTaskItems.and.returnValue(of([]));

    // Configure the testing module with the component and mocks
    await TestBed.configureTestingModule({
      imports: [TaskItemCreate],
      providers: [
        { provide: TaskItemService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemCreate);
    component = fixture.componentInstance;
  });

  /**
   * Test that the component is created successfully.
   */
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  /**
   * Test form initialization with default values.
   */
  it('should initialize form with default values', () => {
    fixture.detectChanges();
    const form = component.taskForm;
    expect(form).toBeTruthy();
    expect(form.get('status')?.value).toBe(TaskStatus.Pending);
    expect(form.get('title')?.value).toBe('');
  });

  /**
   * Test that tasks are loaded and usernames are extracted correctly.
   */
  it('should load tasks and extract usernames', () => {
    const tasks: TaskItem[] = [
      { id: 1, title: 'Test 1', description: 'Desc', status: TaskStatus.Pending, assignedUser: 'Alice', createdDate: new Date('2025-08-30') },
      { id: 2, title: 'Test 2', description: 'Desc', status: TaskStatus.Completed, assignedUser: 'Bob', createdDate: new Date('2025-08-30') }
    ];
    mockTaskService.getAllTaskItems.and.returnValue(of(tasks));

    fixture.detectChanges();
    expect(component.tasks.length).toBe(2);
    expect(component.usernames).toEqual(['Alice', 'Bob']);
  });

  /**
   * Test the private _filter method for filtering usernames.
   */
  it('should filter usernames correctly', () => {
    component.usernames = ['Alice', 'Bob', 'Charlie'];
    const result = (component as any)._filter('al'); // Access private method
    expect(result).toEqual(['Alice']);
  });

  /**
   * Test form submission for creating a task successfully.
   */
  it('should submit form and create task successfully', fakeAsync(() => {
    const newTask: TaskItem = {
      id: 0,
      title: 'New',
      description: 'Task',
      status: TaskStatus.Pending,
      assignedUser: 'Alice',
      createdDate: new Date()
    };

    mockTaskService.createTaskItem.and.returnValue(of(newTask));

    fixture.detectChanges();
    component.taskForm.setValue({
      title: 'New',
      description: 'Task',
      status: TaskStatus.Pending,
      assignedUser: 'Alice',
      createdDate: new Date()
    });

    component.onSubmit();
    tick(); // simulate async observable completion

    expect(mockTaskService.createTaskItem).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Tâche créée avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  /**
   * Test error handling when task creation fails.
   */
  it('should handle error when task creation fails', fakeAsync(() => {
    mockTaskService.createTaskItem.and.returnValue(throwError(() => new Error('Server error')));

    fixture.detectChanges();
    component.taskForm.setValue({
      title: 'Bad',
      description: 'Task',
      status: TaskStatus.Pending,
      assignedUser: 'Alice',
      createdDate: new Date()
    });

    component.onSubmit();
    tick();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Erreur lors de la création de la tâche', 'Fermer', { duration: 3000, verticalPosition: 'top' });
  }));

  /**
   * Test the goBack method for navigating back to the task list.
   */
  it('should navigate back when goBack is called', () => {
    fixture.detectChanges();
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
