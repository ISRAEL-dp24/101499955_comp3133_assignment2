import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { AddEmployeeComponent } from './components/add-employee/add-employee';
import { ViewEmployeeComponent } from './components/view-employee/view-employee';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: 'employees/add', component: AddEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'employees/:id/view', component: ViewEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'employees/:id/edit', component: EditEmployeeComponent, canActivate: [AuthGuard] },
];

export default routes;

