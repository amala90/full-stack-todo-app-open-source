import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskItemDetails } from './task-item-details';
import { TaskItemService } from '../../core/services/taskitem.service';
import { TaskStatus } from '../../core/enums/task-status.enum';
import { TaskItem } from '../../core/models/taskitem.model';

/**
 * Unit tests for TaskItemDetails component.
 * Covers component creation, task loading, status color logic,
 * navigation, deletion, and status change.
 */
describe('TaskItemDetails', () => {
  let component: TaskItemDetails;
  let fixture: ComponentFixture<TaskItemDetails>;
  let mockTaskService: jasmine.SpyObj<TaskItemService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  // Override ActivatedRoute to provide invalid ID
  const invalidRoute: Partial<ActivatedRoute> = {
  snapshot: {
    paramMap: convertToParamMap({ id: '0' }),
    url: [],
    params: {},
    queryParams: {},
    fragment: null,
    data: {},
    outlet: 'primary',
    component: null,
    routeConfig: null,
    root: null,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
  } as any
};


  beforeEach(async () => {
    // Create spies for services
    mockTaskService = jasmine.createSpyObj('TaskItemService', ['getTaskItemById', 'deleteTaskItem', 'patchTask']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Mock ActivatedRoute with a valid task ID
    const mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({ id: '1' }) // this creates a real ParamMap object
      }
    };

    // Default task returned by getTaskItemById
    mockTaskService.getTaskItemById.and.returnValue(of({
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Pending,
      assignedUser: 'Alice',
      createdDate: new Date()
    }));

    await TestBed.configureTestingModule({
      imports: [TaskItemDetails],
      providers: [
        { provide: TaskItemService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemDetails);
    component = fixture.componentInstance;
  });

  /**
   * Component should be created successfully.
   */
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  /**
   * Task should load successfully on init.
   */
  it('should load task on init', () => {
    fixture.detectChanges();
    expect(component.task).toBeTruthy();
    expect(component.task?.id).toBe(1);
    expect(component.loading).toBeFalse();
    expect(mockTaskService.getTaskItemById).toHaveBeenCalledWith(1);
  });

  /**
   * Should return correct status color.
   */
  it('should return correct status color', () => {
    expect(component.getStatusColor('Completed')).toBe('primary');
    expect(component.getStatusColor('In Progress')).toBe('accent');
    expect(component.getStatusColor('Blocked')).toBe('warn');
    expect(component.getStatusColor('Unknown')).toBeUndefined();
  });

  /**
   * goBack should navigate to tasks list.
   */
  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  /**
   * deleteTask should call service and reload task on confirm.
   */
  it('should delete task when confirmed', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockTaskService.deleteTaskItem.and.returnValue(of({} as any));
    fixture.detectChanges();

    component.deleteTask(1);
    tick();

    expect(mockTaskService.deleteTaskItem).toHaveBeenCalledWith(1);
    expect(mockTaskService.getTaskItemById).toHaveBeenCalled();
  }));

  /**
   * changeStatus should patch task status and show snackbar.
   */
  it('should change task status successfully', fakeAsync(() => {
    fixture.detectChanges();
    mockTaskService.patchTask.and.returnValue(of({} as any));
    spyOn(component, 'loadTask');

    component.changeStatus(TaskStatus.Completed);
    tick();

    expect(mockTaskService.patchTask).toHaveBeenCalledWith(1, jasmine.any(Array));
    expect(mockSnackBar.open).toHaveBeenCalledWith('Statut mis à jour avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
    expect(component.loadTask).toHaveBeenCalled();
  }));

  /**
   * changeStatus should handle error and show snackbar on failure.
   */
  it('should handle error when patching status fails', fakeAsync(() => {
    fixture.detectChanges();
    mockTaskService.patchTask.and.returnValue(throwError(() => new Error('Patch error')));

    component.changeStatus(TaskStatus.Completed);
    tick();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000, verticalPosition: 'top' });
  }));
});
