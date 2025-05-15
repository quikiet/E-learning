import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, InputIcon, IconField, InputTextModule, FormsModule, PasswordModule, FormElementComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  tab: string = 'login';
  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched(); // Kích hoạt hiển thị lỗi
    }
  }
}
