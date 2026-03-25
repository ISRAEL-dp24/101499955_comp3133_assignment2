import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  loading = true;
  errorMessage = '';
  deleteMessage = '';

  constructor(
    private graphqlService: GraphqlService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.graphqlService.getAllEmployees().subscribe({
      next: (result: any) => {
        this.employees = result.data?.getAllEmployees || [];
        this.filteredEmployees = [...this.employees];
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load employees.';
        this.loading = false;
      }
    });
  }

  viewEmployee(eid: string) {
    this.router.navigate(['/employees', eid, 'view']);
  }

  editEmployee(eid: string) {
    this.router.navigate(['/employees', eid, 'edit']);
  }

  deleteEmployee(eid: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    this.graphqlService.deleteEmployee(eid).subscribe({
      next: () => {
        this.deleteMessage = `${name} deleted successfully.`;
        this.loadEmployees();
        setTimeout(() => this.deleteMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Delete failed.';
      }
    });
  }

  addEmployee() {
    this.router.navigate(['/employees/add']);
  }

  logout() {
    this.authService.logout();
  }
}