import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/admin';
  constructor(private http: HttpClient) { }

  getAllUser(page: number, perPage: number, filters?: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (filters) {
      if (filters.username) params = params.set('username', filters.username);
      if (filters.fullname) params = params.set('fullname', filters.fullname);
      if (filters.email) params = params.set('email', filters.email);
      if (filters.role) params = params.set('role', filters.role);
      if (filters.gender) params = params.set('gender', filters.gender);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.birthdate) params = params.set('birthdate', filters.birthdate);
    }

    return this.http.get(`${this.apiUrl}/users`, { params, withCredentials: true });
  }


  createUser(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, data, { withCredentials: true });
  }

  showUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, { withCredentials: true });
  }

  showUserDeleted(page: number = 1, perPage: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/trashed?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  restoreDeleteUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/restore`, {}, { withCredentials: true });
  }

  forceDeleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}/force`, { withCredentials: true });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`, { withCredentials: true });
  }
}
