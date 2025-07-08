import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { FormElementComponent } from '../form-element/form-element.component';
import { PasswordModule } from 'primeng/password';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { AuthService } from '../../../services/auth.service';
import { UploadService } from '../../../services/upload.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePipe } from '@angular/common';

interface City {
  name: string;
  code: string;
}

interface OptionSelect {
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
    DatePickerModule
  ],
  providers: [MessageService, DatePipe, CategoryService, AuthService, UploadService],
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
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
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'other' }
  ];
  LoE: OptionSelect[] = [
    { name: 'Unknown', value: 'Unknown' },
    { name: 'Beginner', value: 'Beginner' },
    { name: 'Intermediate', value: 'Intermediate' },
    { name: 'Advanced', value: 'Advanced' }
  ];
  learningGoals = [
    { label: 'Career Advancement', value: 'Career advancement' },
    { label: 'Skill Development', value: 'Skill development' },
    { label: 'Personal Growth', value: 'Personal growth' },
    { label: 'Academic Improvement', value: 'Academic improvement' },
    { label: 'Certification', value: 'Certification' }
  ];
  currentYear = new Date().getFullYear();
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private uploadService: UploadService,
    private datePipe: DatePipe
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      LoE_DI: ['', [Validators.maxLength(50)]],
      birthdate: [null],
      gender: [''],
      avatar: [null],
      bio: ['', [Validators.maxLength(1000)]],
      organization: ['', [Validators.maxLength(100)]],
      name: ['', [Validators.maxLength(100)]],
      category_ids: [[]]
    });

    this.passwordForm = this.fb.group({
      old_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      repeat_password: ['', Validators.required]
    }, { validators: this.confirmedValidator('new_password', 'repeat_password') });
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
          value: cat.id
        }));
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load categories.',
          life: 3000
        });
      }
    });
  }

  loadUserProfile() {
    this.authService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.user = res.user;
        console.log('User data loaded:', this.user);

        if (!this.user.username) {
          console.error('Username is missing in user data');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Username is required and cannot be empty.',
            life: 3000
          });
          return;
        }

        this.profileForm.patchValue({
          username: this.user.username,
          LoE_DI: this.user.LoE_DI || '',
          birthdate: this.user.birthdate ? new Date(this.user.birthdate) : null,
          gender: this.user.gender || '',
          bio: this.user.role === 'instructor' ? this.user.instructor?.bio || '' : '',
          organization: this.user.role === 'instructor' ? this.user.instructor?.organization || '' : '',
          name: this.user.role === 'instructor' ? this.user.instructor?.name || '' : '',
          category_ids: this.user.category_ids || []
        });
        this.avatarPreview = this.user.avatar || null;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load user profile.',
          life: 3000
        });
      }
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
        life: 3000
      });
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    const formValue = this.profileForm.value;

    // Log form value before processing
    console.log('Form value before sending:', formValue);

    // Validate username
    if (!formValue.username || formValue.username.trim() === '') {
      console.error('Username is missing or empty');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Username is required and cannot be empty.',
        life: 3000
      });
      this.isSubmitting = false;
      return;
    }

    // Format birthdate to Y-m-d (YYYY-MM-DD)
    if (formValue.birthdate) {
      const formattedBirthdate = this.datePipe.transform(formValue.birthdate, 'yyyy-MM-dd');
      if (formattedBirthdate) {
        formData.append('birthdate', formattedBirthdate); // Use 'YoB' to match API
      } else {
        console.warn('Invalid birthdate format');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid birthdate format.',
          life: 3000
        });
        this.isSubmitting = false;
        return;
      }
    }

    // Add other fields to FormData
    for (const key in formValue) {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        if (key === 'category_ids') {
          if (Array.isArray(formValue[key]) && formValue[key].length > 0) {
            formValue[key].forEach((id: number, index: number) => {
              formData.append(`category_ids[${index}]`, id.toString());
            });
          }
        } else if (key === 'avatar' || key === 'birthdate') {
          continue; // Skip avatar and birthdate (handled separately)
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

    // Add avatar file if selected
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    } else {
      console.warn('No file selected for avatar');
    }

    // Log FormData entries for debugging
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    this.authService.updateUser(formData).subscribe({
      next: (response: any) => {
        console.log('Update profile success:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Profile updated successfully.',
          life: 3000
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
          summary: 'Error',
          detail: err.error?.message || 'Unable to update profile.',
          life: 3000
        });
        this.isSubmitting = false;
        this.resetForm();
      }
    });
  }

  onResetPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all password fields correctly.',
        life: 3000
      });
      return;
    }

    this.isPasswordSubmitting = true;
    const formValue = this.passwordForm.value;

    this.authService.changePassword(formValue).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Password reset successfully.',
          life: 3000
        });
        this.resetPasswordForm();
        this.isPasswordSubmitting = false;
      },
      error: (err) => {
        console.error('Password reset error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.error || 'Unable to reset password.',
          life: 3000
        });
        this.isPasswordSubmitting = false;
      }
    });
  }

  resetForm() {
    this.profileForm.reset({
      username: this.user?.username || '',
      LoE_DI: this.user?.LoE_DI || '',
      birthdate: this.user?.birthdate ? new Date(this.user.birthdate) : null,
      gender: this.user?.gender || '',
      bio: this.user?.role === 'instructor' ? this.user.instructor?.bio || '' : '',
      organization: this.user?.role === 'instructor' ? this.user.instructor?.organization || '' : '',
      name: this.user?.role === 'instructor' ? this.user.instructor?.name || '' : '',
      category_ids: this.user?.category_ids || []
    });
    this.selectedFile = null;
    this.avatarPreview = this.user?.avatar || null;
  }

  resetPasswordForm() {
    this.passwordForm.reset({ email: this.user?.email || '' });
  }
}