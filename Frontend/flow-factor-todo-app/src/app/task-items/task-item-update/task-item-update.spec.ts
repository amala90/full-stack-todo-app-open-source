import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskItemUpdate } from './task-item-update';
import { TaskItemService } from '../../core/services/taskitem.service';
import { TaskStatus } from '../../core/enums/task-status.enum';

/**
 * Unit tests for TaskItemUpdate component.
 * Tests cover component creation, form initialization, task loading by ID,
 * form submission, error handling, and navigation.
 */
describe('TaskItemUpdate', () => {
  let component: TaskItemUpdate;
  let fixture: ComponentFixture<TaskItemUpdate>;
  let mockTaskService: jasmine.SpyObj<TaskItemService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    // Mock services
    mockTaskService = jasmine.createSpyObj('TaskItemService', ['getTaskItemById', 'updateTaskItem']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    
    // Mock ActivatedRoute with a paramMap containing task ID 1
   const mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({ id: '1' }) // this creates a real ParamMap object
      }
    };

    // Default mock behavior for getTaskItemById
    mockTaskService.getTaskItemById.and.returnValue(of({
      id: 1,
      title: 'Test Task',
      description: 'Test description',
      status: TaskStatus.Pending,
      assignedUser: 'Alice',
      createdDate: new Date()
    }));

    await TestBed.configureTestingModule({
      imports: [TaskItemUpdate],
      providers: [
        { provide: TaskItemService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemUpdate);
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
   * Test form initialization with default values and loading task from service.
   */
  it('should initialize form and load task by ID', () => {
    fixture.detectChanges();
    const form = component.taskForm;
    expect(form).toBeTruthy();
    expect(form.get('title')?.value).toBe('Test Task');
    expect(form.get('description')?.value).toBe('Test description');
    expect(form.get('status')?.value).toBe(TaskStatus.Pending);
    expect(component.taskId).toBe(1);
    expect(mockTaskService.getTaskItemById).toHaveBeenCalledWith(1);
  });

  /**
   * Test successful form submission and task update.
   */
  it('should submit form and update task successfully', fakeAsync(() => {
    mockTaskService.updateTaskItem.and.returnValue(of({} as any));

    fixture.detectChanges();
    component.taskForm.setValue({
      title: 'Updated Task',
      description: 'Updated description',
      status: TaskStatus.Completed,
      assignedUser: 'Alice',
      createdDate: new Date()
    });

    component.onSubmit();
    tick();

    expect(mockTaskService.updateTaskItem).toHaveBeenCalledWith(1, jasmine.objectContaining({
      title: 'Updated Task'
    }));
    expect(mockSnackBar.open).toHaveBeenCalledWith('Tâche mise à jour avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  /**
   * Test error handling when task update fails.
   */
  it('should handle error when task update fails', fakeAsync(() => {
    mockTaskService.updateTaskItem.and.returnValue(throwError(() => new Error('Server error')));

    fixture.detectChanges();
    component.taskForm.setValue({
      title: 'Updated Task',
      description: 'Updated description',
      status: TaskStatus.Completed,
      assignedUser: 'Alice',
      createdDate: new Date()
    });

    component.onSubmit();
    tick();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Erreur lors de la mise à jour de la tâche', 'Fermer', { duration: 3000, verticalPosition: 'top' });
  }));

  /**
   * Test navigation back to task list using goBack method.
   */
  it('should navigate back when goBack is called', () => {
    fixture.detectChanges();
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  /**
   * Test behavior when task ID is invalid.
   */
  it('should log error if task ID is invalid', () => {
    // Override ActivatedRoute to return null ID
    component.taskId = NaN;
    spyOn(console, 'error');

    component.loadTask();
    expect(console.error).toHaveBeenCalledWith('Invalid task ID');
  });

  /**
   * Test behavior when task is not found.
   */
  it('should log error if task not found', () => {
    spyOn(console, 'error');
    mockTaskService.getTaskItemById.and.returnValue(of(null as any));

    component.taskId = 1;
    component.loadTask();

    expect(console.error).toHaveBeenCalledWith('Task not found');
  });
});
