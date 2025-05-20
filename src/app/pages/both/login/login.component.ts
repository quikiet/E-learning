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
  imports: [Divider, RadioButton, FieldsetModule, DatePicker, Select, ReactiveFormsModule, CommonModule, InputIcon, IconField, InputTextModule, FormsModule, PasswordModule, FormElementComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  LoE: optionSelect[] | undefined;
  gender: optionSelect[] | undefined;
  learningGoals = [
    { label: 'Thăng tiến sự nghiệp', value: 'Career advancement' },
    { label: 'Phát triển kỹ năng', value: 'Skill development' },
    { label: 'Phát triển bản thân', value: 'Personal growth' },
    { label: 'Cải thiện học tập', value: 'Academic improvement' },
    { label: 'Lấy chứng chỉ', value: 'Certification' }
  ];
  interests = [
    { label: 'Lập trình', value: 'Programming' },
    { label: 'Phân tích dữ liệu', value: 'Data Analysis' },
    { label: 'Thiết kế đồ họa', value: 'Graphic Design' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Lãnh đạo', value: 'Leadership' },
    { label: 'Sản xuất âm nhạc', value: 'Music Production' }
  ];


  selectedLoE: optionSelect | undefined;
  tab: string = 'login';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  currentYear = new Date().getFullYear();
  minYear = 1900;
  maxYear = this.currentYear - 13;

  minDate = new Date(this.minYear, 0);
  maxDate = new Date(this.maxYear, 11);
  registerForm!: FormGroup;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private route: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      final_cc_cname_DI: ['VietNam', Validators.maxLength(100)],
      LoE_DI: ['', Validators.maxLength(50)],
      YoB: [null, [Validators.min(1900), Validators.max(this.currentYear - 13)]],
      gender: [''],
      // gender: ['', [Validators.required, Validators.pattern(/^(Male|Female|Prefer not to say)$/)]],
      role: ['student', Validators.required], // mặc định là student
      // Student fields
      learning_goals: [''],
      interests: [''],
    }, { validators: this.passwordMatchValidator });
    this.LoE = [
      { name: 'Không rõ', value: 'Unknown' },
      { name: 'THPT', value: 'High School' },
      { name: 'Đại học', value: 'Bachelor' },
      { name: 'Thạc sĩ', value: 'Master' },
      { name: 'Tiến sĩ', value: 'PhD' }
    ];
    this.gender = [
      { name: 'Không', value: "" },
      { name: 'Nam', value: 'Male' },
      { name: 'Nữ', value: 'Female' },
      { name: 'Không muốn trả lời', value: 'Prefer not to say' },
    ];
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
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          console.log('Đăng nhập thành công!');
          this.route.navigate(['/']);
        }, error: () => {
          console.log('Đăng nhập thất bại!');
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); // Kích hoạt hiển thị lỗi
    }
  }

  onSubmitRegister() {
    this.isLoading = true;
    if (this.registerForm.valid) {
      const data = {
        ...this.registerForm.value,
        LoE_DI: this.registerForm.value.LoE_DI?.value || '',
        gender: this.registerForm.value.gender?.value || '',
        YoB: this.registerForm.value.YoB ? new Date(this.registerForm.value.YoB).getFullYear() : null,
        password_confirmation: this.registerForm.value.password_confirmation,
      };
      console.log(data);

      this.authService.register(data).subscribe({
        next: (res) => {
          this.tab = 'login';
          alert('Đăng ký thành công');
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
          alert('Đăng ký thất bại');
        }, complete: () => {
          this.isLoading = false;
          this.registerForm.reset();
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

}
