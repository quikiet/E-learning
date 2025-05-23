import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../pages/both/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }

  register(data: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<{ message: string; token: string; user: any }> {
    return this.http.post<{ message: string; token: string; user: any }>(`${this.apiUrl}/login`, data, { withCredentials: true })
      .pipe(
        tap(res => {
          const expiry = new Date().getTime() + 60 * 60 * 1000; // 60 phút
          localStorage.setItem('token_expiry', expiry.toString());
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/currentStudent `, { withCredentials: true });
  }
}
