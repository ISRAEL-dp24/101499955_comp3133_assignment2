import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { AddEmployeeComponent } from './components/add-employee/add-employee';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: 'employees/add', component: AddEmployeeComponent, canActivate: [AuthGuard] },
];

export default routes;