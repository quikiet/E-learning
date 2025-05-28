import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar'; import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms'; import { Select, SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { Skeleton } from 'primeng/skeleton';
import { FormElementComponent } from "../form-element/form-element.component";
import { PasswordModule } from 'primeng/password';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { AuthService } from '../../../services/auth.service';
import { MultiSelectModule } from 'primeng/multiselect';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-profile-info',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    AvatarModule,
    DividerModule,
    SelectModule,
    PasswordModule,
    FileUploadModule,
    MultiSelectModule,
    FormElementComponent,
  ],
  providers: [MessageService],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: any = null;
  isSubmitting = false;
  avatarPreview: string | null = null;
  isPasswordSubmitting = false;
  categories: any[] = [];
  genderOptions = [
    { label: 'Nam', value: 'Male' },
    { label: 'Nữ', value: 'Female' },
    { label: 'Khác', value: 'other' },
  ];
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      final_cc_cname_DI: ['', [Validators.maxLength(100)]],
      LoE_DI: ['', [Validators.maxLength(50)]],
      YoB: [null, [Validators.min(1900), Validators.max(this.currentYear - 13)]],
      gender: [''],
      avatar: [null],
      learning_goals: [''],
      category_ids: [[]],
      bio: ['', [Validators.maxLength(1000)]],
      organization: ['', [Validators.maxLength(100)]],
      name: ['', [Validators.maxLength(100)]],
    });

    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
    }, { validators: this.confirmedValidator('password', 'password_confirmation') });
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['confirmed']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmed: true });
        return { confirmed: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadUserProfile();
  }

  loadCategories() {
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.categories = res.map((cat: any) => ({
          label: cat.name,
          value: cat.id,
        }));
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh mục',
          life: 3000,
        });
      },
    });
  }

  loadUserProfile() {
    this.authService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.profileForm.patchValue({
          username: this.user.username,
          final_cc_cname_DI: this.user.final_cc_cname_DI || '',
          LoE_DI: this.user.LoE_DI || '',
          YoY: this.user.YoY || null,
          gender: this.user.gender || '',
          learning_goals: this.user.role === 'student' ? this.user.student?.learning_goals || '' : '',
          category_ids: this.user.role === 'student' ? this.user.student?.categories?.map((cat: any) => cat.id) || [] : [],
          bio: this.user.role === 'instructor' ? this.user.instructor?.bio || '' : '',
          organization: this.user.role === 'instructor' ? this.user.instructor?.organization || '' : '',
          name: this.user.role === 'instructor' ? this.user.instructor?.name || '' : '',
        });
        this.avatarPreview = this.user.avatar || null;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin người dùng',
          life: 3000,
        });
      },
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.profileForm.patchValue({ avatar: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    const formValue = this.profileForm.value;

    // Append form fields to FormData
    for (const key in formValue) {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        if (key === 'category_ids') {
          formValue[key].forEach((id: number, index: number) => {
            formData.append(`category_ids[${index}]`, id.toString());
          });
        } else if (key === 'avatar' && formValue[key]) {
          formData.append('avatar', formValue[key]);
        } else {
          formData.append(key, formValue[key]);
        }
      }
    }

    this.authService.updateUser(formValue).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: response.message || 'Cập nhật thông tin cá nhân thành công',
          life: 3000,
        });
        this.user = response.user;
        this.avatarPreview = this.user.avatar || null;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể cập nhật thông tin cá nhân',
          life: 3000,
        });
        this.isSubmitting = false;
      },
    });
  }

  onResetPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isPasswordSubmitting = true;
    const formValue = this.passwordForm.value;

    this.authService.changePassword(formValue).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: response.message || 'Đặt lại mật khẩu thành công',
          life: 3000,
        });
        this.resetPasswordForm();
        this.isPasswordSubmitting = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.error || 'Không thể đặt lại mật khẩu',
          life: 3000,
        });
        this.isPasswordSubmitting = false;
      },
    });
  }

  resetForm() {
    this.profileForm.reset();
    this.avatarPreview = this.user.avatar || null;
    this.loadUserProfile();
  }

  resetPasswordForm() {
    this.passwordForm.reset({ email: this.user?.email || '' });
  }
}

