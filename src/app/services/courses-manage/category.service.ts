import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8000/api/admin/category';
  constructor(private http: HttpClient) { }

  getCategory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data, { withCredentials: true });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  showCategory(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  updateCategory(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }
}
