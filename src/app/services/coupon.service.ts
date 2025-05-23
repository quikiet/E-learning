import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = 'http://localhost:8000/api/admin';
  constructor(private http: HttpClient) { }

  getCoupon(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/coupons`, { withCredentials: true });
  }

  createCoupon(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/coupons`, data, { withCredentials: true });
  }

  deleteCoupon(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/coupons/${id}`, { withCredentials: true });
  }

  showCoupon(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/coupons/${id}`, { withCredentials: true });
  }

  updateCoupon(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/coupons/${id}`, data, { withCredentials: true });
  }

}
