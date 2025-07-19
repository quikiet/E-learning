import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AnalystService } from '../../../services/analyst.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RevenueComponentimplements } from "../../../components/admin/revenue/revenue.component";
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-dashboard',
  imports: [CardModule, ChartModule, ToastModule, ProgressSpinnerModule, RevenueComponentimplements, AnimateOnScrollModule, ButtonModule],
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
    private messageService: MessageService,
  ) {
  }




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

    // Define color mapping for statuses
    const statusColorMap: { [key: string]: string } = {
      approved: '#2ECC71',    // Green
      banned: '#E74C3C',      // Red
      draft: '#F1C40F',       // Yellow
      pending: '#3498DB',     // Blue
      rejected: '#7F8C8D',    // Gray
      unavailable: '#9B59B6'  // Purple
    };

    // Pie Chart: Courses by Status
    this.pieChartData = {
      labels: this.analystData.courses_by_status.map((item: any) => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
      datasets: [
        {
          data: this.analystData.courses_by_status.map((item: any) => item.total),
          backgroundColor: this.analystData.courses_by_status.map((item: any) => statusColorMap[item.status.toLowerCase()] || '#95A5A6'), // Fallback gray
          hoverBackgroundColor: this.analystData.courses_by_status.map((item: any) => statusColorMap[item.status.toLowerCase()] || '#95A5A6')
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
          backgroundColor: '#1ABC9C', // Teal
          borderColor: '#1ABC9C',
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