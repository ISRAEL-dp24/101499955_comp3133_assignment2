import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql';
import { SalaryPipe } from '../../pipes/salary.pipe';


@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule, SalaryPipe],
  templateUrl: './view-employee.html',
  styleUrl: './view-employee.css'
})
export class ViewEmployeeComponent implements OnInit {
  employee: any = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private graphqlService: GraphqlService
  ) {}

  ngOnInit() {
    const eid = this.route.snapshot.paramMap.get('id');
    if (!eid) { this.router.navigate(['/employees']); return; }

    this.graphqlService.searchEmployeeById(eid).subscribe({
      next: (result: any) => {
        this.employee = result.data?.searchEmployeeById;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load employee.';
        this.loading = false;
      }
    });
  }

  edit() {
    this.router.navigate(['/employees', this.employee._id, 'edit']);
  }

  back() {
    this.router.navigate(['/employees']);
  }
}