import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-select-role',
  imports: [FormsModule, CommonModule, ButtonModule, ToastModule, DropdownModule, ReactiveFormsModule],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.css'
})
export class SelectRoleComponent implements OnInit {
  roleForm = new FormGroup({
    role: new FormControl('', Validators.required)
  });
  roles = [
    { label: 'Student', value: 'student' },
    { label: 'Instructor', value: 'instructor' }
  ];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() { }

  submitRole() {
    if (this.roleForm.valid) {
      this.isLoading = true;
      const role = this.roleForm.value.role;
      const formData = new FormData();
      formData.append('role', role!);
      this.authService.updateUser(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Vai trò đã được cập nhật!',
            life: 3000
          });
          this.authService.getCurrentUser().subscribe({
            next: (user) => {
              this.authService.setUser(user);
              this.router.navigate(['/dashboard']);
            }
          });
        },
        error: (err) => {
          console.error('Error updating role:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật vai trò. Vui lòng thử lại.',
            life: 3000
          });
          this.isLoading = false;
        }
      });
    }
  }
}