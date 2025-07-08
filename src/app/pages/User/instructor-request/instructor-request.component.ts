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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.instructorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone_number: ['', [Validators.maxLength(20), Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      professional_links: [''],
      bio: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000), Validators.pattern(/^[A-Za-z0-9\s.,!@#$%^&*()_+\-=\[\]{};:"\\',.<>?\/]*$/)]],
      organization: ['', [Validators.maxLength(100)]],
      qualifications: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2000)]],
      teaching_experience: ['', [Validators.maxLength(2000)]],
      expertise: ['', [Validators.maxLength(500)]],
      course_proposal: ['', [Validators.maxLength(2000)]],
      motivation: ['', [Validators.maxLength(1000)]],
      document_urls: [''],
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.instructorForm.invalid) {
      this.instructorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.instructorForm.value;

    // this.authService.instructorRequest(formValue).subscribe({
    //   next: (response: any) => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Thành công',
    //       detail: response.message || 'Yêu cầu trở thành giảng viên đã được gửi.',
    //       life: 3000,
    //     });
    //     this.resetForm();
    //     this.isSubmitting = false;
    //   },
    //   error: (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Lỗi',
    //       detail: error.error?.error || 'Không thể gửi yêu cầu. Vui lòng thử lại.',
    //       life: 3000,
    //     });
    //     this.isSubmitting = false;
    //   },
    // });
  }

  resetForm() {
    this.instructorForm.reset({
      name: '',
      phone_number: '',
      professional_links: '',
      bio: '',
      organization: '',
      qualifications: '',
      teaching_experience: '',
      expertise: '',
      course_proposal: '',
      motivation: '',
      document_urls: '',
    });
  }
}