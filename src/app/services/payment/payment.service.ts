import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }


  getPayments(page: number = 1, perPage: number = 10): Observable<any> {
    let params: any = { page, per_page: perPage };
    return this.http.get<any>(`${this.apiUrl}/payments?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }


  // Lấy chi tiết giao dịch
  getPaymentDetails(paymentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payments/${paymentId}`, { withCredentials: true });
  }


  adminGetPayments(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/payments?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  adminGetPaymentDetails(paymentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/payments/${paymentId}`, { withCredentials: true });
  }
}
