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

  getCoursesByRecommend(course_title: string): Observable<any> {
    return this.http.get(`https://recommendapi.onrender.com/recommend-similar?course_title=${course_title}&num_recommendations=10`);
  }

  getCoursesByEndpoint(endpoint: string, page: number, perPage: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${endpoint}?page=${page}&per_page=${perPage}`).pipe(
      catchError((error) => {
        console.error(`Error fetching courses from ${endpoint}:`, error);
        return throwError(() => new Error('Unable to fetch courses'));
      })
    );
  }

  cloneCourses(courseId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/instructor/course/${courseId}/clone`, {}, { withCredentials: true });
  }

  // Thêm bài học mới (dùng chunk file upload)
  addLesson(courseId: number, data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/instructor/courses/${courseId}/lessons`, data, {
      reportProgress: true,
      observe: 'events',
      withCredentials: true
    });
  }

  // Thêm phương thức cập nhật bài học
  updateLesson(courseId: number, lessonId: number, data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/courses/${courseId}/lessons/${lessonId}`, data, {
      reportProgress: true,
      observe: 'events',
      withCredentials: true
    });
  }

  instructorDeleteLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/instructor/courses/${courseId}/lessons/${lessonId}`, { withCredentials: true });
  }

  getCourseBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${slug}`);
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses_id/${id}`, { withCredentials: true });
  }

  getAllCourses(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/courses`);
  }

  getInstructorCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/allcourses`, { withCredentials: true });
  }

  instructorPublicCourses(course_id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/instructor/courses/${course_id}/status/pending`, {}, { withCredentials: true });
  }

  instructorGetUserProgessCourses(course_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/courses/${course_id}/progress`, { withCredentials: true });
  }

  instructorIssueCertificate(course_id: number, user_id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/instructor/issue-certificate-manual`, { course_id, user_id }, { withCredentials: true });
  }

  // Lấy danh sách bài học của khóa học
  getLessonsForCourse(courseId: number, page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/courses/${courseId}/lessons?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  // Lấy chi tiết bài học
  getLessonDetails(courseId: number, lessonId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/courses/${courseId}/lessons/${lessonId}`, { withCredentials: true });
  }

  // Lấy danh sách bài học đang chờ duyệt của khóa học
  getPendingLessonsForCourse(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/courses/${courseId}/pending-lessons`, { withCredentials: true });
  }

  getPendingCourses(page: number, perPage: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/courses/pending?page=${page}&perPage=${perPage}`, { withCredentials: true });
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

  searchCourseAdmin(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    return this.http.get<any>(`${this.apiUrl}/admin/courses/search`, { params: httpParams, withCredentials: true });
  }

  enrollCourse(courseId: number, data: { amount: number; method: string; coupon_id: number | null }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses/${courseId}/enroll-paid`, data, { withCredentials: true });
  }

  enrollFreeCourse(courseId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses/${courseId}/enroll-free`, {}, { withCredentials: true });
  }

  createCourse(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/instructor/courses`, data, { withCredentials: true });
  }

  createCertifyRule(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/instructor/certificate-rule`, data, { withCredentials: true });
  }

  reportCourse(data: { course_id: number; reason: string; report_type: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reports`, data, { withCredentials: true });
  }

  deleteReportCourse(courseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/reports/${courseId}/cancel`, { withCredentials: true });
  }

  reviewCourse(courseId: number, data: { notes: string | null }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/${courseId}/approve`, data, { withCredentials: true });
  }

  rejectCourse(courseId: number, data: { notes: string | null }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/${courseId}/reject`, data, { withCredentials: true });
  }

  instructorUpdateCourse(courseId: number, data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/instructor/courses/${courseId}`, data, { withCredentials: true });
  }

  instructorDeleteCourse(courseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/instructor/courses/${courseId}`, { withCredentials: true });
  }

  instructorViewDeletedCourse(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/deleted-courses`, { withCredentials: true });
  }

  instructorRestoreCourse(courseId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses/${courseId}/restore`, {}, { withCredentials: true });
  }

  instructorUnavailableCourse(courseId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/instructor/courses/unavailable/${courseId}`, {}, { withCredentials: true });
  }

  instructorAvailableCourse(courseId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/instructor/courses/available/${courseId}`, {}, { withCredentials: true });
  }

  getQuizOfCourse(courseId: number, page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/courses/${courseId}/quizzes?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  getInstructorReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/GetAllreports`, { withCredentials: true });
  }

  adminGetReport(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/reports?page=${page}`, { withCredentials: true });
  }


  // Resolve a report (assumed endpoint)
  resolveReport(reportId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/reports/${reportId}/resolve`, {}).pipe(
      catchError((error) => {
        console.error('Error resolving report:', error);
        return throwError(() => new Error('Unable to resolve report'));
      })
    );
  }


}
