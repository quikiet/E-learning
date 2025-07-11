import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const token_expiry = localStorage.getItem('token_expiry');
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');

  const nowInSeconds = Math.floor(new Date().getTime() / 1000);

  // Nếu có token và còn hạn, user đã đăng nhập thì chặn truy cập và redirect về trang chủ
  if (token && token_expiry && user?.id && nowInSeconds < parseInt(token_expiry)) {
    router.navigate(['/']);
    return false;
  }

  // Nếu không có token hoặc token hết hạn thì cho phép vào route (ví dụ login)
  return true;
};
