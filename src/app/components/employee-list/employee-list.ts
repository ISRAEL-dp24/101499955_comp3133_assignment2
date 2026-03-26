import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql';
import { AuthService } from '../../services/auth';
import { SalaryPipe } from '../../pipes/salary.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SalaryPipe, HighlightDirective],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  loading = true;
  errorMessage = '';
  deleteMessage = '';

  searchDepartment = '';
  searchDesignation = '';
  isSearching = false;

  constructor(
    private graphqlService: GraphqlService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.loading = true;
    this.graphqlService.getAllEmployees().subscribe({
      next: (result: any) => {
        this.employees = result.data?.getAllEmployees || [];
        this.filteredEmployees = [...this.employees];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load employees.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    if (!this.searchDepartment && !this.searchDesignation) {
      this.filteredEmployees = [...this.employees];
      return;
    }
    this.isSearching = true;
    this.graphqlService.searchByDesignationOrDepartment(
      this.searchDesignation || undefined,
      this.searchDepartment || undefined
    ).subscribe({
      next: (result: any) => {
        this.filteredEmployees = result.data?.searchEmployeeByDesignationOrDepartment || [];
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Search failed.';
        this.isSearching = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearSearch() {
    this.searchDepartment = '';
    this.searchDesignation = '';
    this.filteredEmployees = [...this.employees];
  }

  viewEmployee(emp: any) {
    this.router.navigate(['/employees', emp._id, 'view'], {
      state: { employee: emp }
    });
  }

  editEmployee(emp: any) {
    this.router.navigate(['/employees', emp._id, 'edit'], {
      state: { employee: emp }
    });
  }
  addEmployee() { this.router.navigate(['/employees/add']); }
  logout() { this.authService.logout(); }

  deleteEmployee(eid: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    this.graphqlService.deleteEmployee(eid).subscribe({
      next: () => {
        this.deleteMessage = `${name} deleted successfully.`;
        this.loadEmployees();
        setTimeout(() => this.deleteMessage = '', 3000);
      },
      error: (err) => { this.errorMessage = err.message || 'Delete failed.'; }
    });
  }
}