import { Routes } from '@angular/router';
import { TaskItemDetails } from './task-items/task-item-details/task-item-details';
import { TaskItemList } from './task-items/task-item-list/task-item-list';
import { TaskItemCreate } from './task-items/task-item-create/task-item-create';
import { TaskItemUpdate } from './task-items/task-item-update/task-item-update';

// Task item routes
export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { 
    path: 'tasks', 
    component: TaskItemList
  },
  {
    path: 'tasks/details/:id',
    component: TaskItemDetails
  },
  {
    path: 'tasks/create',
    component: TaskItemCreate
  },
  {
    path: 'tasks/update/:id',
    component: TaskItemUpdate
  }
];
