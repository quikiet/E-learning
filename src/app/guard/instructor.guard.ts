import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const instructorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.getCurrentUser().pipe(
    map((res) => {
      const user = res.user;
      if (user && user.role === 'instructor') {
        return true;
      }
      return router.parseUrl('/unauthorization');
    }),
    catchError((err) => {
      console.error('Error fetching user:', err.message);

      return of(router.parseUrl('/unauthorization'));
    })
  );
  // const user = JSON.parse(localStorage.getItem('user') ?? '{}');

  // if (user && user.role === 'instructor') {
  //   return true;
  // }

  // // alert('Access denied. Instructor only!');
  // return router.parseUrl('/unauthorization');
};
