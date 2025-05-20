import { CanActivateFn } from '@angular/router';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token') ?? '';
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  if (token && user && user.id) {
    return true;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};
