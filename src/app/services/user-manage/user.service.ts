import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/admin';
  constructor(private http: HttpClient) { }

  getAllUser(page: number = 1, perPage: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  showUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, { withCredentials: true });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`, { withCredentials: true });
  }
}
