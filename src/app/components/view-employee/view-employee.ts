import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private graphqlService: GraphqlService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const eid = this.route.snapshot.paramMap.get('id');
    if (!eid) { this.router.navigate(['/employees']); return; }

    const navState = this.router.getCurrentNavigation()?.extras?.state ||
                    history.state;
    const stateEmployee = navState?.['employee'];

    if (stateEmployee && stateEmployee._id === eid) {
      this.employee = stateEmployee;
      this.loading = false;
      this.cdr.detectChanges();
    } else {
      this.graphqlService.searchEmployeeById(eid).subscribe({
        next: (result: any) => {
          this.employee = result.data?.searchEmployeeById;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load employee.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  edit() { this.router.navigate(['/employees', this.employee._id, 'edit']); }
  back() { this.router.navigate(['/employees']); }
}