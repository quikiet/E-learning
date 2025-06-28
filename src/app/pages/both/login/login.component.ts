import { CommonModule } from '@angular/common';
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
  imports: [CheckboxModule, Divider, RadioButton, FieldsetModule, DatePicker, Select, ReactiveFormsModule, CommonModule, InputIcon, IconField, InputTextModule, FormsModule, PasswordModule, FormElementComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  LoE: optionSelect[] | undefined;
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
  currentYear = new Date().getFullYear();
  minYear = 1900;
  maxYear = this.currentYear - 3;

  minDate = new Date(this.minYear, 0);
  maxDate = new Date(this.maxYear, 11);
  registerForm!: FormGroup;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private route: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      LoE_DI: ['', Validators.maxLength(50)],
      birthdate: [null],
      gender: [''],
      role: ['student', Validators.required], // mặc định là student
      learning_goals: [''],
      category_ids: [[]],
    }, { validators: this.passwordMatchValidator });
    this.LoE = [
      { name: 'All Level', value: 'All Level' },
      { name: 'Beginner', value: 'Beginner' },
      { name: 'Intermediate', value: 'Intermediate' },
      { name: 'Advanced', value: 'Advanced' },
    ];
    this.gender = [
      { name: 'Male', value: 'Male' },
      { name: 'Female', value: 'Female' },
      { name: 'Prefer not to say', value: 'Prefer not to say' },
    ];
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (error) => {
        alert('Không thể tải danh mục' + error.message);
      }
    });

  }
  onSubmitRegister() {
    this.isLoading = true;
    if (this.registerForm.valid) {
      const data = {
        ...this.registerForm.value,
        LoE_DI: this.registerForm.value.LoE_DI?.value || '',
        gender: this.registerForm.value.gender?.value || '',
        birthdate: this.registerForm.value.birthdate || null,
        category_ids: this.registerForm.value.category_ids || [],
        password_confirmation: this.registerForm.value.password_confirmation,
      };
      console.log(data);

      this.authService.register(data).subscribe({
        next: () => {
          this.tab = 'login';
          alert('Đăng ký thành công');
          this.isLoading = false;
        }, error: (err) => {
          console.error('Registration Error:', err);
          alert('Đăng ký thất bại');
          this.isLoading = false;
        }, complete: () => {
          this.registerForm.reset();
          this.isLoading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.isLoading = false;
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
          console.log('Đăng nhập thành công!');
          this.route.navigate(['/']);
        }, error: (err) => {
          console.log('Đăng nhập thất bại!: ' + err.message);
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); // Kích hoạt hiển thị lỗi
    }
  }



}
