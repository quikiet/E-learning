import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }

  getCourses(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses?page=${page}&perPage=${perPage}`);
  }

  getAllCourses(page: number = 1, perPage: number = 10): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/admin/courses?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

}
