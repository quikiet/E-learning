import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }

  AdminGetAllInstructors(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/instructors?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  getAllInstructors(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/getAllInstructors`);
  }

  getTop10Instructor(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-instructors`);
  }

  getInstructorInfo(instructorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/InfoFull/${instructorId}/courses`, { withCredentials: true });
  }

  getInstructorDetail(month?: number | null, year?: number | null): Observable<any> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get(`${this.apiUrl}/instructor/eachinstructors/details`, { params, withCredentials: true });
  }

  // Xóa mềm giảng viên
  deleteInstructor(instructorId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/instructors/${instructorId}`, { withCredentials: true });
  }

  // Lấy danh sách giảng viên đã bị xóa
  getTrashedInstructors(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/instructors/trashed?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  // Khôi phục giảng viên
  restoreInstructor(instructorId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/instructors/restore/${instructorId}`, {}, { withCredentials: true });
  }

}
