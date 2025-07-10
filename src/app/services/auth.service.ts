import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
        })
      );
  }

  logout(): Observable<any> {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token_expiry');
    this.currentUserSubject.next(null);
    return this.http.post(`${this.apiUrl}/api/logout`, {}, { withCredentials: true });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/currentStudent`, { withCredentials: true });
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


  instructorRequestToBuyCourse(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/updateProfile/student/profile `, data, { withCredentials: true });
  }

  studentRequestToInstructor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/updateProfile/instructor/profile `, data, { withCredentials: true });
  }
}
