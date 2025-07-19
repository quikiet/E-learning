import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormElementComponent } from '../../../components/both/form-element/form-element.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    FormElementComponent
  ],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isSubmitting = false;
  token: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', Validators.required],
      token: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Extract token and email from query params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      if (!this.token || !this.email) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid or missing token/email.',
          life: 3000
        });
        this.cancel();
      } else {
        this.resetPasswordForm.patchValue({
          token: this.token,
          email: this.email
        });
      }
    });
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  cancel() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
        life: 3000
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.resetPasswordForm.value;
    const data = {
      token: formValue.token,
      email: formValue.email,
      password: formValue.password,
      password_confirmation: formValue.password_confirmation
    };

    console.log('Submitting reset password data:', data);

    this.authService.resetPassword(data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Password reset successfully.',
          life: 3000
        });
        this.isSubmitting = false;
        setInterval(() => {
          this.router.navigate(['/login']);

        }, 500);
      },
      error: (err) => {
        console.error('Error resetting password:', err);
        this.messageService.add({
          severity: 'error',
          summary: err.error?.message || 'Error',
          detail: err.error?.error || 'Unable to reset password.',
          life: 3000
        });
        this.isSubmitting = false;
      }
    });
  }
}
