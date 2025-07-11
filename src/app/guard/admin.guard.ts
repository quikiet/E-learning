import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');

  if (user && user.role === 'admin') {
    return true;
  }

  alert('Access denied. Admins only!');
  return router.parseUrl('/');
}