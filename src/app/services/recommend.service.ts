import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecommendService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {
  }

  csvCourse() {
    return this.http.get<any>(`${this.apiUrl}/save/courses`);
  }

  csvEnrollments() {
    return this.http.get<any>(`${this.apiUrl}/save/enrollments`);
  }

  updateModel() {
    return this.http.get<any>(`${this.apiUrl}/recommend/export-send`);
    // return this.http.post<any>(`http://127.0.0.1:9000/recommend/update-model`, {});
  }
}
