import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.css'
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  loading = true;
  saving = false;
  errorMessage = '';
  photoPreview: string | null = null;
  photoBase64: string | null = null;
  photoError = '';
  employeeId = '';

  departments = ['Engineering','Marketing','Sales','Human Resources','Finance','Operations','Design','Legal'];
  designations = ['Software Engineer','Senior Software Engineer','Tech Lead','Engineering Manager','Product Manager','Designer','Marketing Manager','Sales Representative','HR Manager','Financial Analyst','Operations Manager','Legal Counsel'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private graphqlService: GraphqlService
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name:  ['', [Validators.required, Validators.minLength(2)]],
      email:      ['', [Validators.required, Validators.email]],
      gender:     ['', Validators.required],
      designation:['', Validators.required],
      salary:     ['', [Validators.required, Validators.min(1000), Validators.max(999999)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  get f() { return this.employeeForm.controls; }

  ngOnInit() {
    const eid = this.route.snapshot.paramMap.get('id');
    if (!eid) { this.router.navigate(['/employees']); return; }
    this.employeeId = eid;

    this.graphqlService.searchEmployeeById(eid).subscribe({
      next: (result: any) => {
        const emp = result.data?.searchEmployeeById;
        if (!emp) { this.router.navigate(['/employees']); return; }

        // Format date to yyyy-MM-dd for the date input
        const dateVal = emp.date_of_joining
          ? new Date(emp.date_of_joining).toISOString().split('T')[0]
          : '';

        this.employeeForm.patchValue({
          first_name: emp.first_name,
          last_name:  emp.last_name,
          email:      emp.email,
          gender:     emp.gender,
          designation:emp.designation,
          salary:     emp.salary,
          date_of_joining: dateVal,
          department: emp.department,
        });

        if (emp.employee_photo) {
          this.photoPreview = emp.employee_photo;
          this.photoBase64  = emp.employee_photo;
        }

        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load employee.';
        this.loading = false;
      }
    });
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.photoError = '';
    if (!file) return;

    if (!['image/jpeg','image/png','image/gif','image/webp'].includes(file.type)) {
      this.photoError = 'Only JPG, PNG, GIF or WEBP allowed.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.photoError = 'Image must be under 2MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.photoBase64 = reader.result as string;
      this.photoPreview = this.photoBase64;
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview = null;
    this.photoBase64 = null;
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.errorMessage = '';

    const payload = {
      eid: this.employeeId,
      ...this.employeeForm.value,
      salary: parseFloat(this.employeeForm.value.salary),
      employee_photo: this.photoBase64 || null,
    };

    this.graphqlService.updateEmployee(payload).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err) => {
        this.errorMessage = err.message || 'Failed to update employee.';
        this.saving = false;
      }
    });
  }

  cancel() { this.router.navigate(['/employees']); }
}