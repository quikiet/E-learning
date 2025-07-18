import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { CoursesService } from '../../../services/courses.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Tag } from "primeng/tag";

@Component({
  selector: 'app-report-manage',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, ToastModule, PaginatorModule, ProgressSpinnerModule, Tag],
  providers: [MessageService, CoursesService],
  templateUrl: './report-manage.component.html',
  styleUrls: ['./report-manage.component.css']
})
export class ReportManageComponent implements OnInit {
  reports: any[] = [];
  selectedReport: any = null;
  isLoading: boolean = false;
  displayDialog: boolean = false;
  currentPage: number = 1;
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  first: number = 0;
  constructor(
    private coursesService: CoursesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadReports(this.currentPage);
  }

  loadReports(page: number) {
    this.isLoading = true;
    this.coursesService.adminGetReport(page).subscribe({
      next: (res) => {
        this.reports = res.data;
        this.currentPage = res.current_page;
        this.totalRecords = res.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reports:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load reports. Please try again.', // Không thể tải báo cáo
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // API uses 1-based page numbers
    this.first = event.first; // Update first for paginator UI
    this.rowsPerPage = event.rows; // Update rows per page if changed
    this.loadReports(this.currentPage);
  }

  viewReport(report: any) {
    this.selectedReport = report;
    this.displayDialog = true;
  }

  resolveReport(reportId: number) {
    this.coursesService.resolveReport(reportId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Report resolved successfully.', // Báo cáo được giải quyết
          life: 3000
        });
        this.loadReports(this.currentPage);
      },
      error: (err) => {
        console.error('Error resolving report:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to resolve report. Please try again.', // Không thể giải quyết báo cáo
          life: 3000
        });
      }
    });
  }

  formatDate(date: string | null): string {
    return date ? new Date(date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';
  }
}