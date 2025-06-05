import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }


  adminReviewLesson(lessonId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/lessons/${lessonId}/review`, { status }, { withCredentials: true });
  }
}
