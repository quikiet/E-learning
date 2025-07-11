import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isLoggedIn()) {
    return true;
  }
  messageService.add({
    severity: 'warn',
    summary: 'Access Denied',
    detail: 'Please log in to access this page.',
    life: 3000
  });
  router.navigate(['/login']);
  return false;
};
