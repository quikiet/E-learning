// src/app/components/profile-info/profile-info.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';
import { PasswordModule } from 'primeng/password';
import { FormElementComponent } from '../form-element/form-element.component';
import { AuthService } from '../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { LoadingComponent } from "../loading/loading.component";
import { CheckboxModule } from 'primeng/checkbox';
import { CategoryService } from '../../../services/courses-manage/category.service';

interface OptionSelect {
  label: string;
  value: string;
}

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    ProgressSpinnerModule,
    FileUploadModule,
    FieldsetModule,
    PasswordModule,
    DividerModule,
    AvatarModule,
    DatePickerModule,
    SelectModule,
    FormElementComponent,
    RadioButtonModule,
    CheckboxModule,
    LoadingComponent
  ],
  providers: [MessageService, DatePipe, AuthService],
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: any = null;
  isSubmitting = false;
  isLoading = false;
  avatarPreview: string | null = null;
  isPasswordSubmitting = false;
  selectedFile: File | null = null;
  genderOptions: OptionSelect[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'other' }
  ];
  loeOptions: OptionSelect[] = [
    { label: 'Unknown', value: 'Unknown' },
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ];
  learningGoals = [
    { label: 'Career advancement', value: 'Career advancement' },
    { label: 'Skill development', value: 'Skill development' },
    { label: 'Personal growth', value: 'Personal growth' },
    { label: 'Academic improvement', value: 'Academic improvement' },
    { label: 'Certification', value: 'Certification' }
  ];
  categories: any[] = [];
  // learningGoalOptions: OptionSelect[] = [
  //   { label: 'Career Advancement', value: 'Career advancement' },
  //   { label: 'Skill Development', value: 'Skill development' },
  //   { label: 'Personal Growth', value: 'Personal growth' },
  //   { label: 'Academic Improvement', value: 'Academic improvement' },
  //   { label: 'Certification', value: 'Certification' }
  // ];
  minDate: Date = new Date(1900, 0, 1); // January 1, 1900
  maxDate: Date = new Date();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: [[Validators.required, Validators.maxLength(50)]],
      fullname: [[Validators.maxLength(100)]],
      email: [{ value: '', disabled: true }, [Validators.email]],
      birthdate: [null],
      gender: [''],
      bio: ['', [Validators.maxLength(1000)]],
      organization: ['', [Validators.maxLength(100)]],
      email_paypal: ['', [Validators.email]],
      LoE_DI: [''],
      learning_goals: [''],
      total_courses_completed: [{ value: 0, disabled: true }],
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
    this.isLoading = true;
    console.log('Initializing ProfileInfoComponent');
    this.authService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.user = res.user;
        console.log('User data loaded:', this.user);

        if (!this.user.username) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Username is required and cannot be empty.',
            life: 3000
          });
          this.isLoading = false;
          this.router.navigate(['/login']);
          return;
        }

        this.profileForm.patchValue({
          username: this.user.username,
          fullname: this.user.fullname,
          email: this.user.email,
          birthdate: this.user.birthdate ? new Date(this.user.birthdate) : null,
          gender: this.user.gender || '',
          bio: this.user.instructor?.bio || '',
          organization: this.user.instructor?.organization || '',
          email_paypal: this.user.instructor?.email_paypal || '',
          LoE_DI: this.user.student?.LoE_DI || '',
          learning_goals: this.user.student?.learning_goals || '',
          total_courses_completed: this.user.student?.total_courses_completed || 0,
          category_ids: this.user.categories?.map((cat: any) => cat.id) || [] // Set category_ids
        });

        if (this.user.role === 'instructor') {
          this.profileForm.get('bio')?.setValidators([Validators.required, Validators.maxLength(1000)]);
          this.profileForm.get('email_paypal')?.setValidators([Validators.required, Validators.email]);
        }

        this.profileForm.updateValueAndValidity();
        this.avatarPreview = this.user.avatar || null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load user profile. Please log in again.',
          life: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });

    this.loadCategory();
  }

  loadCategory() {
    this.isLoading = true;
    this.categoryService.getAllCategory().subscribe({
      next: (res) => {
        this.categories = res;
        this.isLoading = false;
      }, error: (err) => {
        console.log(err.error.message);
        this.isLoading = false;
      }
    })
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
    this.isLoading = true;
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
    const formValue = this.profileForm.getRawValue();
    const fields = ['username', 'fullname', 'gender', 'bio', 'organization', 'email_paypal', 'LoE_DI', 'learning_goals'];
    fields.forEach(key => {
      if (formValue[key]) {
        formData.append(key, formValue[key]);
      }
    });
    console.log('Form value before sending:', formValue);
    if (formValue.category_ids?.length) {
      formValue.category_ids.forEach((id: number) => {
        formData.append('category_ids[]', id.toString());
      });
    }
    if (formValue.birthdate) {
      const formattedBirthdate = this.datePipe.transform(formValue.birthdate, 'yyyy-MM-dd');
      if (formattedBirthdate) {
        formData.append('birthdate', formattedBirthdate);
      } else {
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
    fields.forEach(key => {
      if (formValue[key]) {
        formData.append(key, formValue[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }

    this.authService.updateUser(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Update profile success:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
          life: 3000
        });
        this.user = response.user;
        this.avatarPreview = this.user.avatar || null;
        this.isSubmitting = false;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Update profile error:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000
        });
        this.isSubmitting = false;
      }
    });
  }

  onResetPassword() {
    this.isLoading = true;
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
        this.isLoading = false;
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
        this.isLoading = false;
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
      fullname: this.user?.fullname || '',
      email: this.user?.email || '',
      birthdate: this.user?.birthdate ? new Date(this.user.birthdate) : null,
      gender: this.user?.gender || '',
      bio: this.user?.instructor?.bio || '',
      organization: this.user?.instructor?.organization || '',
      email_paypal: this.user?.instructor?.email_paypal || '',
      LoE_DI: this.user?.student?.LoE_DI || '',
      learning_goals: this.user?.student?.learning_goals || '',
      total_courses_completed: this.user?.student?.total_courses_completed || 0
    });
    this.selectedFile = null;
    this.avatarPreview = this.user?.avatar || null;
  }

  resetPasswordForm() {
    this.passwordForm.reset({
      old_password: '',
      new_password: '',
      repeat_password: ''
    });
  }
}