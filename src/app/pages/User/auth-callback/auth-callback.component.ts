import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';

import { LoadingComponent } from '../../../components/both/loading/loading.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [LoadingComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let token = this.authService.getCookie('jwt_token') || params['token'];
      console.log('Query params token:', params['token']);
      console.log('Cookie jwt_token:', this.authService.getCookie('jwt_token'));
      console.log('Token used:', token);
      const requireRole = params['require_role'] === 'true';

      if (token) {
        console.log('Token received:', token);
        this.authService.storeToken(token);
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công', // Success
              detail: `Chào mừng !`,
              life: 3000
            });
            const redirectTo = requireRole ? '/select-role' : '/';
            this.router.navigate([redirectTo]);
          },
          error: (err) => {
            console.error('Error fetching user:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi', // Error
              detail: 'Không thể lấy thông tin người dùng. Vui lòng thử lại.', // Unable to fetch user info
              life: 3000
            });
            this.router.navigate(['/']);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        console.error('No token found in query params or cookie');
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi', // Error
          detail: 'Không tìm thấy token đăng nhập.', // No login token found
          life: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });
  }
}