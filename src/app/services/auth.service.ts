import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.post<{ message: string; token: string; user: any }>(`${this.apiUrl}/login`, data);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('headers: ', headers);

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }
}
