
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-social-callback',
  imports: [ToastModule, ProgressSpinnerModule],
  templateUrl: './social-callback.component.html',
  styleUrl: './social-callback.component.css'
})
export class SocialCallbackComponent implements OnInit {
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const requireRole = params['require_role'] === 'true';

      if (token) {
        // Lưu token và lấy thông tin người dùng
        this.authService.storeToken(token);
        this.authService.getCurrentUser().subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Welcome !`,
              life: 3000
            });
            // Chuyển hướng dựa trên require_role
            // if (requireRole) {
            //   this.router.navigate(['/select-role']);
            // } else {
            //   this.router.navigate(['/dashboard']);
            // }
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error fetching user:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể lấy thông tin người dùng. Vui lòng thử lại.',
              life: 3000
            });
            this.router.navigate(['/login']);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không tìm thấy token đăng nhập.',
          life: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });
  }
}