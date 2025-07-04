import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../components/both/loading/loading.component';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  providers: [MessageService],
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const requireRole = this.route.snapshot.queryParamMap.get('require_role_selection') === 'true';

    if (token) {
      this.authService.storeToken(token);
      this.isLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Logged in successfully.',
        life: 3000
      });
      this.router.navigate([requireRole ? '/select-role' : '/']);
    } else {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Google login failed: No token received.',
        life: 3000
      });
      this.router.navigate(['/login']);
    }
  }
}