import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalystService {
  private apiUrl = 'http://localhost:8000/api'; // Adjust to your backend URL

  constructor(private http: HttpClient) { }

  getAnalystData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/statistics`, { withCredentials: true });
  }

}
