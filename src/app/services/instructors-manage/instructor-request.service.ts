import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorRequestService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }

  getPendingRequests(page: number, perPage: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/instructor-requests/pending?page=${page}&per_page=${perPage}`, { withCredentials: true });
  }


  reviewRequest(requestId: number, data: { status: string, admin_notes: string | null }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/instructor/request/${requestId}/review`, data, { withCredentials: true });
  }

}
