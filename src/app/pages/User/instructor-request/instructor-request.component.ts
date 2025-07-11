import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
import { AuthService } from '../../../services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-instructor-request',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    FormElementComponent,
    ProgressSpinnerModule
],
  templateUrl: './instructor-request.component.html',
  styleUrl: './instructor-request.component.css',
  providers: [MessageService],
})
export class InstructorRequestComponent implements OnInit {
  instructorForm: FormGroup;
  isSubmitting = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.instructorForm = this.fb.group({
      bio: ['', [Validators.required, Validators.maxLength(255)]],
      organization: [''],
      email_paypal: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Initializing InstructorRequestComponent');
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('User data loaded:', user);
        this.instructorForm.patchValue({
          bio: user.instructor?.bio || '',
          organization: user.instructor?.organization || '',
          email_paypal: user.email_paypal || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.',
          life: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmitFormRequest() {
    if (this.instructorForm.valid) {
      this.isSubmitting = true;
      this.isLoading = true;
      const data = { ...this.instructorForm.value };
      console.log('Submitting form data:', data);

      this.authService.studentRequestToInstructor(data).subscribe({
        next: (res) => {
          console.log('Request response:', res);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
            life: 3000
          });
          this.instructorForm.reset();
          this.isSubmitting = false;
          this.isLoading = false;
          setInterval(() => {
            this.router.navigate(['/create-course']);
          }, 1000);
        },
        error: (err) => {
          console.error('Error submitting request:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: err.error?.message,
            life: 3000
          });
          this.isSubmitting = false;
          this.isLoading = false;
        }
      });
    } else {
      console.log('Form invalid:', this.instructorForm.errors);
      this.instructorForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Please fill out all required fields.',
        life: 3000
      });
      this.isLoading = false;
    }
  }

  resetForm() {
    this.instructorForm.reset({
      bio: '',
      organization: '',
      email_paypal: ''
    });
  }
}