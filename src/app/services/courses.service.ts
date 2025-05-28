import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }

  getCourses(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses?page=${page}&perPage=${perPage}`,
      {
        params: { page: page.toString(), perPage: perPage.toString() }
      });
  }

  getAllCourses(page: number = 1, perPage: number = 10): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/admin/courses?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  searchCourses(params: any): Observable<any> {
    let httpParams = new HttpParams();

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key].toString());
      }
    }

    return this.http.get<any>(`${this.apiUrl}/courses/search`, { params: httpParams }).pipe(
      catchError((error) => {
        console.error('Search Courses Error:', error);
        let errorMessage = 'Đã xảy ra lỗi khi tìm kiếm khóa học.';
        if (error.status === 404) {
          errorMessage = 'Không tìm thấy endpoint tìm kiếm khóa học.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

}
