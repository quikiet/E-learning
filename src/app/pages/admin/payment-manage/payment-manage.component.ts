import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PaymentService } from '../../../services/payment/payment.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-payment-manage',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    TooltipModule
  ],
  providers: [MessageService, PaymentService],
  templateUrl: './payment-manage.component.html',
  styleUrls: ['./payment-manage.component.css']
})
export class PaymentManageComponent implements OnInit {
  payments: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalRecords: number = 0;
  isLoading: boolean = true;
  showDetailsDialog: boolean = false;
  selectedPayment: any = null;
  first: number = 0; // Track first item for paginator

  constructor(
    private paymentService: PaymentService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.isLoading = true;
    this.paymentService.adminGetPayments(this.currentPage, this.perPage).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        if (res && res.data && res.data.data) {
          this.payments = res.data.data;
          this.currentPage = res.data.current_page;
          this.perPage = res.data.per_page;
          this.totalRecords = res.data.total;
          this.first = (res.data.current_page - 1) * this.perPage; // Sync paginator
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
          summary: 'Error',
          detail: err.error?.message || 'Unable to load payment history. Please try again.',
          life: 3000
        });
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.perPage = event.rows;
    this.first = event.first;
    this.loadPayments();
  }

  viewPaymentDetails(paymentId: number) {
    this.paymentService.adminGetPaymentDetails(paymentId).subscribe({
      next: (res) => {
        console.log('Payment Details Response:', res);
        this.selectedPayment = res.data;
        this.showDetailsDialog = true;
      },
      error: (err) => {
        console.error('Error loading payment details:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to load payment details. Please try again.',
          life: 3000
        });
      }
    });
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }
}