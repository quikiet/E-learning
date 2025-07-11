import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { LoginRequest } from '../pages/both/login/login.component';

interface User {
  id: number;
  username: string;
  email: string;
  role: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    const userData = localStorage.getItem('auth_user');
    if (token && userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  // isAuthenticated(): boolean {
  //   const cookies = document.cookie.split(';').reduce((acc, cookie) => {
  //     const [name, value] = cookie.trim().split('=');
  //     acc[name] = value;
  //     return acc;
  //   }, {} as { [key: string]: string });
  //   const isAuthenticated = !!cookies['jwt_token'];
  //   console.log('Checking auth:', isAuthenticated);
  //   return isAuthenticated;
  // }

  loginWithGoogle() {
    return this.http.get<any>(`${this.apiUrl}/auth/google`);
  }

  storeToken(token: string) {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('token_expiry', (new Date().getTime() + 60 * 60 * 1000).toString()); // 60 phút
  }

  getToken(): string | null {
    const expiry = localStorage.getItem('token_expiry');
    if (expiry && new Date().getTime() > parseInt(expiry)) {
      this.logout();
      return null;
    }
    return localStorage.getItem('jwt_token');
  }

  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  register(data: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/api/register`, data);
  }

  login(data: LoginRequest): Observable<{ message: string; token: string; user: any }> {
    return this.http.post<{ message: string; token: string; user: any }>(`${this.apiUrl}/api/login`, data, { withCredentials: true })
      .pipe(
        tap(res => {
          const expiry = new Date().getTime() + 60 * 60 * 1000; // 60 phút
          localStorage.setItem('token_expiry', expiry.toString());
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        })
      );
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');
    this.currentUserSubject.next(null);
    return this.http.post(`${this.apiUrl}/api/logout`, {}, { withCredentials: true });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/currentStudent`, { withCredentials: true });
  }

  isLoggedIn(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/currentStudent`, { withCredentials: true }).pipe(
      map((response: any) => response.user || null),
      catchError(() => {
        console.error('Error fetching user data');
        return of(null);
      })
    );
  }

  isInstructor(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user) => {
        const isInstructor = user?.role === 'instructor' && !!user?.instructor;
        // console.log('Checking instructor:', isInstructor, user);
        return isInstructor;
      }),
      catchError(() => of(false))
    );
  }

  isAdmin(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user) => {
        const isAdmin = user?.role === 'admin';
        console.log('Checking admin:', isAdmin, user);
        return isAdmin;
      }),
      catchError(() => of(false))
    );
  }

  // getCurrentUser() {
  //   return this.http.get(`${this.apiUrl}/user`, {
  //     headers: {
  //       'Authorization': `Bearer ${this.getToken()}`
  //     }
  //   });
  // }

  updateUser(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/profile/update`, data, { withCredentials: true });
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/change-password`, data, { withCredentials: true });
  }

  sendMailResetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/password/email`, data, { withCredentials: true });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/password/reset`, data, { withCredentials: true });
  }

  instructorRequestToBuyCourse(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/updateProfile/student/profile `, data, { withCredentials: true });
  }

  studentRequestToInstructor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/updateProfile/instructor/profile `, data, { withCredentials: true });
  }
}
