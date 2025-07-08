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
    if (token) {
      this.currentUserSubject.next({ id: 0, username: '', email: '', role: null });
    }
  }

  initiateGoogleLogin() {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  storeToken(token: string) {
    localStorage.setItem('jwt_token', token);
    this.currentUserSubject.next({ id: 0, username: '', email: '', role: null });
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
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
    return this.http.post(`${this.apiUrl}/api/logout`, {}, { withCredentials: true });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/currentStudent `, { withCredentials: true });
  }


  updateUser(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/profile/update`, data, { withCredentials: true });
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/change-password`, data, { withCredentials: true });
  }


  instructorRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/instructor/request `, data, { withCredentials: true });
  }
}
