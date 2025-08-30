import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

import { TaskItemList } from './task-item-list';
import { TaskItemService } from '../../core/services/taskitem.service';
import { TaskStatus } from '../../core/enums/task-status.enum';
import { TaskItem } from '../../core/models/taskitem.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskItemList', () => {
  let component: TaskItemList;
  let fixture: ComponentFixture<TaskItemList>;
  let mockTaskService: jasmine.SpyObj<TaskItemService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;


beforeEach(async () => {
  mockTaskService = jasmine.createSpyObj('TaskItemService', ['getAllTaskItems', 'deleteTaskItem', 'patchTask']);
  mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

  mockTaskService.getAllTaskItems.and.returnValue(of([]));

  await TestBed.configureTestingModule({
    imports: [TaskItemList, HttpClientTestingModule], // <- add this
    providers: [
      { provide: Router, useValue: mockRouter },
      { provide: MatSnackBar, useValue: mockSnackBar },
      { 
        provide: ActivatedRoute, 
        useValue: { snapshot: { paramMap: convertToParamMap({}) } } 
      },
      { provide: TaskItemService, useValue: mockTaskService } // always mock
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(TaskItemList);
  component = fixture.componentInstance;
});

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    const tasks: TaskItem[] = [
      { id: 1, title: 'Task 1', description: 'Desc 1', status: TaskStatus.Pending, assignedUser: 'Alice', createdDate: new Date() },
      { id: 2, title: 'Task 2', description: 'Desc 2', status: TaskStatus.Completed, assignedUser: 'Bob', createdDate: new Date() }
    ];
    mockTaskService.getAllTaskItems.and.returnValue(of(tasks));

    fixture.detectChanges();

    expect(component.tasks.length).toBe(2);
    expect(component.length).toBe(2);
    expect(component.pagedTasks.length).toBeLessThanOrEqual(component.pageSize);
  });

  it('should update paged tasks on pagination change', () => {
    const tasks: TaskItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1, title: `Task ${i + 1}`, description: 'Desc', status: TaskStatus.Pending, assignedUser: 'User', createdDate: new Date()
    }));
    component.tasks = tasks;

    const event: PageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    component.onPageChange(event);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(component.pagedTasks.length).toBe(5);
    expect(component.pagedTasks[0].id).toBe(6);
  });

  it('should navigate to create task page', () => {
    component.createTask();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks/create']);
  });

  it('should navigate to edit task page', () => {
    component.editTask(42);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks/update', 42]);
  });

  it('should navigate to task details page', () => {
    component.detailsTask(42);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks/details/42']);
  });

  it('should delete a task successfully', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockTaskService.deleteTaskItem.and.returnValue(of({} as any));

    fixture.detectChanges();
    component.deleteTask(1);
    tick();

    expect(mockTaskService.deleteTaskItem).toHaveBeenCalledWith(1);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Tâche supprimée avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
    expect(mockTaskService.getAllTaskItems).toHaveBeenCalled(); // reload tasks
  }));

  it('should handle delete task error', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockTaskService.deleteTaskItem.and.returnValue(throwError(() => new Error('Delete error')));

    fixture.detectChanges();
    component.deleteTask(1);
    tick();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Erreur lors de la suppression de la tâche', 'Fermer', { duration: 3000, verticalPosition: 'top' });
  }));

  it('should change task status successfully', fakeAsync(() => {
    const task: TaskItem = { id: 1, title: 'T1', description: '', status: TaskStatus.Pending, assignedUser: 'A', createdDate: new Date() };
    const updatedTask: TaskItem = { ...task, status: TaskStatus.Completed };
    mockTaskService.patchTask.and.returnValue(of(updatedTask));

    fixture.detectChanges();
    component.changeStatus(task, TaskStatus.Completed);
    tick();

    expect(mockTaskService.patchTask).toHaveBeenCalledWith(task.id, [{ op: 'replace', path: '/Status', value: TaskStatus.Completed }]);
    expect(task.status).toBe(TaskStatus.Completed);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Statut mis à jour avec succès', 'Fermer', { duration: 3000, verticalPosition: 'top' });
  }));

  it('should handle change status error', fakeAsync(() => {
    const task: TaskItem = { id: 1, title: 'T1', description: '', status: TaskStatus.Pending, assignedUser: 'A', createdDate: new Date() };
    mockTaskService.patchTask.and.returnValue(throwError(() => new Error('Patch error')));

    fixture.detectChanges();
    component.changeStatus(task, TaskStatus.Completed);
    tick();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Erreur lors de la mise à jour de la tâche', 'Fermer', { duration: 3000, verticalPosition: 'top' });
  }));
});
