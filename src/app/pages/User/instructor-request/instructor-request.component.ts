import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-instructor-request',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    FormElementComponent
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
    private messageService: MessageService
  ) {
    this.instructorForm = this.fb.group({
      bio: ['', Validators.maxLength(255), Validators.required],
      organization: [''],
      email_paypal: ['', Validators.required, Validators.email],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    // Lấy thông tin người dùng hiện tại để điền vào form
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user.instructor) {
          this.instructorForm.patchValue({
            bio: user.instructor.bio || '',
            organization: user.instructor.organization || '',
            email_paypal: user.email_paypal || ''
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể tải thông tin người dùng. Vui lòng thử lại.',
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  onSubmitFormRequest() {
    if (this.instructorForm.valid) {
      this.isSubmitting = true;
      const data = {
        ...this.instructorForm.value
      };

      this.authService.studentRequestToInstructor(data).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: res.message || 'Yêu cầu làm giảng viên đã được gửi!',
            life: 3000
          });
          this.instructorForm.reset();
          this.isSubmitting = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error submitting request:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: err.error?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.',
            life: 3000
          });
          this.isSubmitting = false;
          this.isLoading = false;
        }
      });
    } else {
      this.instructorForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền đầy đủ các trường bắt buộc.',
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