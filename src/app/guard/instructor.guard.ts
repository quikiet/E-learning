import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

export const instructorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (!authService.isLoggedIn()) {
    messageService.add({
      severity: 'warn',
      summary: 'Access Denied',
      detail: 'Please log in to access this page.',
      life: 3000
    });
    router.navigate(['/login']);
    return false;
  }
  return authService.isInstructor().pipe(
    tap((isInstructor) => {
      if (!isInstructor) {
        messageService.add({
          severity: 'warn',
          summary: 'Access Denied',
          detail: 'You are not authorized as an instructor.',
          life: 3000
        });
        router.navigate(['/']);
      }
    })
  );
};
