import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Phương thức lấy danh sách khóa học đã mua của sinh viên
  getStudentEnrollments(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/enrollments/student?page=${page}&per_page=${perPage}`, { withCredentials: true });
  }

  getStudentProgressEnrollment(enrollmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/enrollments/${enrollmentId}/progress`, { withCredentials: true });
  }

  // Lấy danh sách bài học của khóa học
  getCourseLessons(enrollmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${enrollmentId}/lessons`, { withCredentials: true });
  }

  markLessonComplete(lessonId: number, status: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lessons/${lessonId}/progress`, { status }, { withCredentials: true });
  }


}