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
import { UploadService } from '../../../services/upload.service';
import { RadioButtonModule } from 'primeng/radiobutton';
interface City {
  name: string;
  code: string;
}

interface optionSelect {
  name: string;
  value: string;
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
    RadioButtonModule,
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
  LoE: optionSelect[] | undefined;
  selectedFile: File | null = null;
  learningGoals = [
    { label: 'Thăng tiến sự nghiệp', value: 'Career advancement' },
    { label: 'Phát triển kỹ năng', value: 'Skill development' },
    { label: 'Phát triển bản thân', value: 'Personal growth' },
    { label: 'Cải thiện học tập', value: 'Academic improvement' },
    { label: 'Lấy chứng chỉ', value: 'Certification' }
  ];
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private uploadService: UploadService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      final_cc_cname_DI: ['', [Validators.maxLength(100)]],
      LoE_DI: ['', [Validators.maxLength(50)]],
      YoB: [null, [Validators.min(1900), Validators.max(this.currentYear - 13)]],
      gender: [''],
      avatar: [null],
      learning_goals: [''],
      bio: ['', [Validators.maxLength(1000)]],
      organization: ['', [Validators.maxLength(100)]],
      name: ['', [Validators.maxLength(100)]],
    });

    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
    }, { validators: this.confirmedValidator('password', 'password_confirmation') });

    this.LoE = [
      { name: 'Không rõ', value: 'Unknown' },
      { name: 'THPT', value: 'High School' },
      { name: 'Đại học', value: 'Bachelor' },
      { name: 'Thạc sĩ', value: 'Master' },
      { name: 'Tiến sĩ', value: 'PhD' }
    ];
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
        // console.log('User data loaded:', this.user);

        if (!this.user.username) {
          console.error('Username is missing in user data');
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Tên người dùng không được để trống',
            life: 3000,
          });
          return;
        }

        this.profileForm.patchValue({
          username: this.user.username,
          final_cc_cname_DI: this.user.final_cc_cname_DI || '',
          LoE_DI: this.user.LoE_DI || '',
          YoB: this.user.YoB || null,
          gender: this.user.gender || '',
          learning_goals: this.user.role === 'student' ? this.user.student?.learning_goals || '' : '',
          bio: this.user.role === 'instructor' ? this.user.instructor?.bio || '' : '',
          organization: this.user.role === 'instructor' ? this.user.instructor?.organization || '' : '',
          name: this.user.role === 'instructor' ? this.user.instructor?.name || '' : '',
        });
        this.avatarPreview = this.user.avatar || null;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
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
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      console.log('Profile form invalid:', this.profileForm.errors);
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    const formValue = this.profileForm.value;

    // Log giá trị form trước khi gửi
    console.log('Form value before sending:', formValue);

    // Kiểm tra username
    if (!formValue.username || formValue.username.trim() === '') {
      console.error('Username is missing or empty');
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Tên người dùng là bắt buộc và không được để trống',
        life: 3000,
      });
      this.isSubmitting = false;
      return;
    }

    // Thêm các trường vào FormData
    for (const key in formValue) {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        if (key === 'category_ids') {
          if (Array.isArray(formValue[key]) && formValue[key].length > 0) {
            formValue[key].forEach((id: number, index: number) => {
              formData.append(`category_ids[${index}]`, id.toString());
            });
          }
        } else if (key === 'avatar') {
          continue; // Bỏ qua avatar vì sẽ xử lý riêng
        } else {
          const value = String(formValue[key]).trim();
          if (value !== '') {
            formData.append(key, value);
          } else {
            console.warn(`Skipping empty field: ${key}`);
          }
        }
      }
    }

    // Thêm file avatar nếu có
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    } else {
      console.warn('No file selected for avatar');
    }

    // Log toàn bộ FormData để kiểm tra
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    this.authService.updateUser(formData).subscribe({
      next: (response: any) => {
        console.log('Update profile success:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: response.message || 'Cập nhật thông tin cá nhân thành công',
          life: 3000,
        });
        this.user = response.user;
        this.avatarPreview = this.user.avatar || null;
        this.isSubmitting = false;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Update profile error:', err);
        console.error('Error details:', err.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể cập nhật thông tin cá nhân',
          life: 3000,
        });
        this.isSubmitting = false;
        this.resetForm();
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
    this.selectedFile = null; // Reset file
    this.avatarPreview = this.user.avatar || null;
    this.loadUserProfile();
  }

  resetPasswordForm() {
    this.passwordForm.reset({ email: this.user?.email || '' });
  }
}

