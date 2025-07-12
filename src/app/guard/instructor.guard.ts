import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const instructorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');

  if (user && user.role === 'instructor') {
    return true;
  }

  // alert('Access denied. Instructor only!');
  return router.parseUrl('/unauthorization');
};
