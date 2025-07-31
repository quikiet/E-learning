import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PaymentService } from '../../../services/payment/payment.service';
@Component({
  selector: 'app-student-payment-history',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    DialogModule,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './student-payment-history.component.html',
  styleUrl: './student-payment-history.component.css'
})
export class StudentPaymentHistoryComponent implements OnInit {
  payments: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalRecords: number = 0;
  isLoading: boolean = true;
  showDetailsDialog: boolean = false;
  selectedPayment: any = null;

  constructor(
    private paymentService: PaymentService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.isLoading = true;
    this.paymentService.getPayments(this.currentPage, this.perPage).subscribe({
      next: (res) => {
        console.log('API Response:', res); // Debug API response
        if (res && res.data && res.data.data) {
          this.payments = res.data.data; // Gán dữ liệu từ res.data.data
          this.currentPage = res.data.current_page;
          this.perPage = res.data.per_page;
          this.totalRecords = res.data.total;
        } else {
          this.payments = [];
          this.totalRecords = 0;
          console.warn('No payments found in response');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: err.error?.message,
          detail: err.error?.error,
          life: 3000,
        });
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.perPage = event.rows;
    this.loadPayments();
  }

  viewPaymentDetails(paymentId: number) {
    this.paymentService.getPaymentDetails(paymentId).subscribe({
      next: (res) => {
        console.log('Payment Details Response:', res); // Debug chi tiết giao dịch
        this.selectedPayment = res.data;
        this.showDetailsDialog = true;
      },
      error: (err) => {
        console.error('Error loading payment details:', err);
        this.messageService.add({
          severity: 'error',
          summary: err.error?.message,
          detail: err.error?.error,
          life: 3000,
        });
      }
    });
  }
}