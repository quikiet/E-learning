import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
@Component({
  selector: 'app-login',
  imports: [CommonModule, InputIcon, IconField, InputTextModule, FormsModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  tab: string = 'login';

}
