import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GraphqlService } from '../../services/graphql';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  loading = false;
  errorMessage = '';
  photoPreview: string | null = null;
  photoBase64: string | null = null;
  photoError = '';

  departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Design',
    'Legal',
  ];

  designations = [
    'Software Engineer',
    'Senior Software Engineer',
    'Tech Lead',
    'Engineering Manager',
    'Product Manager',
    'Designer',
    'Marketing Manager',
    'Sales Representative',
    'HR Manager',
    'Financial Analyst',
    'Operations Manager',
    'Legal Counsel',
  ];

  constructor(
    private fb: FormBuilder,
    private graphqlService: GraphqlService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [
        '',
        [Validators.required, Validators.min(1000), Validators.max(999999)],
      ],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  get f() {
    return this.employeeForm.controls;
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.photoError = '';

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.photoError = 'Only JPG, PNG, GIF or WEBP images are allowed.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.photoError = 'Image must be smaller than 2MB.';
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
    this.photoError = '';
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      ...this.employeeForm.value,
      salary: parseFloat(this.employeeForm.value.salary),
      employee_photo: this.photoBase64 || null,
    };

    this.graphqlService.addEmployee(payload).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to add employee.';
        this.loading = false;
      },
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}