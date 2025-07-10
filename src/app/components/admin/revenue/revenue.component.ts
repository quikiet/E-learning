import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AnalystService } from '../../../services/analyst.service';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-revenue',
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, ChartModule],
  providers: [MessageService, DatePipe, AnalystService],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css'
})
export class RevenueComponentimplements implements OnInit {
  sessions: any[] = [];
  isCreating = false;
  distributingSessions: number[] = [];
  barChartData: any;
  barChartOptions: any;

  constructor(
    private analystService: AnalystService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadSessions();
    this.prepareChartData();
  }

  loadSessions() {
    this.analystService.getRevenueSession().subscribe({
      next: (res) => {
        this.sessions = res.data;
        console.log('Revenue sessions loaded:', this.sessions);
        this.prepareChartData();
      },
      error: (err) => {
        console.error('Error loading revenue sessions:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000
        });
      }
    });
  }

  createSession() {
    this.isCreating = true;
    this.analystService.createNewSession().subscribe({
      next: (response: any) => {
        this.isCreating = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
          life: 3000
        });
        this.loadSessions();
      },
      error: (err) => {
        this.isCreating = false;
        console.error('Error creating session:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message,
          life: 3000
        });
      }
    });
  }

  distributeSession(sessionId: number) {
    this.distributingSessions.push(sessionId);
    this.analystService.distributeSession(sessionId).subscribe({
      next: (response: any) => {
        this.distributingSessions = this.distributingSessions.filter(id => id !== sessionId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
          life: 3000
        });
        this.loadSessions();
      },
      error: (err) => {
        this.distributingSessions = this.distributingSessions.filter(id => id !== sessionId);
        console.error('Error distributing session:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message,
          life: 3000
        });
      }
    });
  }

  prepareChartData() {
    this.barChartData = {
      labels: this.sessions.map(session => `${this.datePipe.transform(`2025-${session.month}-01`, 'MMM yyyy')}`),
      datasets: [
        {
          label: 'Revenue',
          data: this.sessions.map(session => parseFloat(session.total_revenue)),
          backgroundColor: '#1ABC9C',
          borderColor: '#1ABC9C',
          borderWidth: 1
        }
      ]
    };

    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Monthly Revenue' }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Profit (USD)' }
        }
      }
    };
  }
}