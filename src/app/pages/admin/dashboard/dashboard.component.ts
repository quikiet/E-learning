import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AnalystService } from '../../../services/analyst.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardModule, ChartModule, ToastModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  analystData: any = null;
  isLoading: boolean = false;
  pieChartData: any;
  pieChartOptions: any;
  barChartData: any;
  barChartOptions: any;

  constructor(
    private analystService: AnalystService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadAnalystData();
    this.initializeChartOptions();
  }

  loadAnalystData() {
    this.isLoading = true;
    this.analystService.getAnalystData().subscribe({
      next: (res) => {
        this.analystData = res;
        this.prepareChartData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading analyst data:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message, // Không thể tải dữ liệu phân tích
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  prepareChartData() {
    if (!this.analystData) return;

    // Pie Chart: Courses by Status
    this.pieChartData = {
      labels: this.analystData.courses_by_status.map((item: any) => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
      datasets: [
        {
          data: this.analystData.courses_by_status.map((item: any) => item.total),
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };

    // Bar Chart: Courses by Category
    this.barChartData = {
      labels: this.analystData.courses_by_category.map((item: any) => item.name),
      datasets: [
        {
          label: 'Courses',
          data: this.analystData.courses_by_category.map((item: any) => item.total),
          backgroundColor: '2FC7A1',
          borderColor: '#2FC7A1',
          borderWidth: 1
        }
      ]
    };
  }

  initializeChartOptions() {
    this.pieChartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#1F2937', // Tailwind gray-800
            font: {
              size: 14,
              family: 'Inter, sans-serif'
            }
          }
        }
      }
    };

    this.barChartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#1F2937', // Tailwind gray-800
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: '#1F2937', // Tailwind gray-800
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            },
            beginAtZero: true
          },
          grid: {
            color: '#E5E7EB' // Tailwind gray-200
          }
        }
      }
    };
  }

  formatCurrency(amount: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));
  }
}