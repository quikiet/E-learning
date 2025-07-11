import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButton } from 'primeng/radiobutton';
import { Divider } from 'primeng/divider';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";



export interface LoginRequest {
  email: string,
  password: string,
}

interface optionSelect {
  name: string;
  value: string;
}

@Component({
  selector: 'app-login',
  imports: [FloatLabel, TextareaModule, CheckboxModule, Divider, RadioButton, FieldsetModule, DatePicker, Select, ReactiveFormsModule, CommonModule, InputIcon, IconField, InputTextModule, FormsModule, PasswordModule, FormElementComponent, Toast],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  LoE: optionSelect[] | undefined;
  role: optionSelect[] | undefined;
  gender: optionSelect[] | undefined;
  learningGoals = [
    { label: 'Career advancement', value: 'Career advancement' },
    { label: 'Skill development', value: 'Skill development' },
    { label: 'Personal growth', value: 'Personal growth' },
    { label: 'Academic improvement', value: 'Academic improvement' },
    { label: 'Certification', value: 'Certification' }
  ];
  categories: any[] = [];

  selectedLoE: optionSelect | undefined;
  tab: string = 'login';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  registerForm!: FormGroup;
  forgetForm!: FormGroup;
  isLoading = false;
  forgetPassword = false;

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private route: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      LoE_DI: ['', Validators.maxLength(50)],
      birthdate: [null],
      fullname: ['',],
      gender: [''],
      bio: [''],
      organization: [''],
      role: ['student', Validators.required], // mặc định là student
      learning_goals: [''],
      category_ids: [[]],
    }, { validators: this.passwordMatchValidator });

    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.LoE = [
      { name: 'All Level', value: 'All Level' },
      { name: 'Beginner', value: 'Beginner' },
      { name: 'Intermediate', value: 'Intermediate' },
      { name: 'Advanced', value: 'Advanced' },
    ];

    this.role = [
      { name: 'Student', value: 'student' },
      { name: 'Instructor', value: 'instructor' },
    ];
    this.gender = [
      { name: 'Male', value: 'Male' },
      { name: 'Female', value: 'Female' },
      { name: 'Other', value: 'other' },
    ];
    this.categoryService.getAllCategory().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (error) => {
        alert('Không thể tải danh mục' + error.message);
      }
    });
  }

  dateValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;
      let dateString = value instanceof Date
        ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
        : value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return { invalidDateFormat: true };
      return null;
    };
  }

  onDateSelect(event: Date) {
    const formattedDate = event
      ? `${event.getFullYear()}-${String(event.getMonth() + 1).padStart(2, '0')}-${String(event.getDate()).padStart(2, '0')}`
      : null;
    console.log('Selected date:', formattedDate);
    this.registerForm.patchValue({ birthdate: formattedDate });
  }

  onSubmitRegister() {
    // console.log('Form value:', this.registerForm.value); // Log giá trị form
    // console.log('Form valid:', this.registerForm.valid); // Log trạng thái hợp lệ
    // console.log('Form errors:', this.registerForm.errors);
    this.isLoading = true;
    if (this.registerForm.valid) {
      const data = {
        ...this.registerForm.value,
        LoE_DI: this.registerForm.value.LoE_DI?.value || '',
        learning_goals: this.registerForm.value.learning_goals?.value || '',
        gender: this.registerForm.value.gender?.value || '',
        birthdate: this.registerForm.value.birthdate || null,
        category_ids: this.registerForm.value.category_ids || [],
        password_confirmation: this.registerForm.value.password_confirmation,
        bio: this.registerForm.value.role === 'instructor' ? this.registerForm.value.bio : null,
        organization: this.registerForm.value.role === 'instructor' ? this.registerForm.value.organization : null
      };
      console.log(data);

      this.authService.register(data).subscribe({
        next: () => {
          this.tab = 'login';
          alert('Đăng ký thành công');
          this.isLoading = false;
        }, error: (err) => {
          console.error('Registration Error:', err);
          alert(err.error.message);
          this.isLoading = false;
        }, complete: () => {
          this.registerForm.reset();
          this.isLoading = false;
        }
      });
    } else {
      console.log('Form không hợp lệ, lỗi:', this.registerForm.errors);
      this.isLoading = false;
      this.registerForm.markAllAsTouched();
    }
  }

  onSubmitForgetPassword() {
    this.isLoading = true;
    if (this.forgetForm.valid) {
      const data = {
        ...this.forgetForm.value,
      };
      this.authService.sendMailResetPassword(data).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log(res);

          this.messageService.add({ severity: 'success', summary: 'Suceess', detail: res.message, life: 3000 });
        }, error: (err) => {
          this.isLoading = false;
          console.log(err);

          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error, life: 3000 });
        }
      });
    }
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (res) => {
          // console.log('Form submitted:', this.loginForm.value);
          // console.log(res.message);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.message, life: 3000 });
          // console.log('Đăng nhập thành công!');
          if (res.user) {
            if (res.user.role === 'admin') {
              this.route.navigate(['/admin']);
            } else {
              this.route.navigate(['/']);
            }
          }
        }, error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.message, life: 3000 });
          console.log('Login error: ' + err.message);
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); // Kích hoạt hiển thị lỗi
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: (res) => {
        window.location.href = res.url;
        console.log(res);
      }, error: (err) => {
        console.log(err);
      }
    });
  }

}
