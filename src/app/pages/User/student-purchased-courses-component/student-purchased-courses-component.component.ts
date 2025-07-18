import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { EnrollmentService } from '../../../services/enrollments/enrollment.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CardSkeletonComponent } from "../../../components/both/card-skeleton/card-skeleton.component";
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-student-purchased-courses-component',
  standalone: true,
  imports: [
    CommonModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    RouterLink,
    ProgressBarModule,
    InputTextModule,
    FormsModule,
    CardSkeletonComponent,
    SelectModule,
    TooltipModule
  ],
  providers: [MessageService, CoursesService],
  templateUrl: './student-purchased-courses-component.component.html',
  styleUrls: ['./student-purchased-courses-component.component.css'],
})
export class StudentPurchasedCoursesComponentComponent implements OnInit {
  enrollments: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalRecords: number = 0;
  isLoading: boolean = true;
  showReportModal: boolean = false;
  progressData: { [key: number]: any } = {};
  reportData = {
    course_id: 0,
    reason: '',
    report_type: '',
  };
  reportTypes = [
    { label: 'Inappropriate Content', value: 'inappropriate_content' },
    { label: 'Copyright Violation', value: 'copyright_violation' },
    { label: 'Technical issue', value: 'technical_issue' },
    { label: 'Spam', value: 'spam' },
    { label: 'Other', value: 'other' },
  ];

  constructor(
    private enrollmentService: EnrollmentService,
    private coursesService: CoursesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.isLoading = true;
    this.enrollmentService.getStudentEnrollments(this.currentPage, this.perPage).subscribe({
      next: (res) => {
        this.enrollments = res.data.data;
        this.currentPage = res.data.current_page;
        this.perPage = res.data.per_page;
        this.totalRecords = res.data.total;
        this.isLoading = false;

        this.enrollments.forEach((enrollment) => {
          this.loadProgress(enrollment.id);
        });
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách khóa học đã mua. Vui lòng thử lại.',
          life: 3000,
        });
      },
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.perPage = event.rows;
    this.loadEnrollments();
  }

  loadProgress(enrollmentId: number) {
    this.enrollmentService.getStudentProgressEnrollment(enrollmentId).subscribe({
      next: (res) => {
        this.progressData[enrollmentId] = res.data;
      },
      error: (err) => {
        console.error(`Error loading progress for enrollment ${enrollmentId}:`, err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải tiến độ học tập. Vui lòng thử lại.',
          life: 3000,
        });
      },
    });
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split('');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join('') + '...';
  }

  openReportModal(enrollment: any) {
    this.reportData.course_id = enrollment.course.id;
    this.showReportModal = true;
  }
  isReporting = false;
  submitReport() {
    this.isReporting = true;
    if (!this.reportData.reason || !this.reportData.report_type) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please fill in the complete reason and type of report.',
        life: 3000,
      });
      return;
    }
    // console.log(this.reportData);

    this.coursesService.reportCourse(this.reportData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.isReporting = false;
        this.showReportModal = false;
        this.loadEnrollments();
        this.resetReportForm();
      },
      error: (err) => {
        this.isReporting = false;
        this.messageService.add({
          severity: 'error',
          summary: err.error.message || 'Error',
          detail: err.error.error,
          life: 3000,
        });
      },
    });
  }

  undoReport(reportId: number) {
    this.isLoading = true;
    this.coursesService.deleteReportCourse(reportId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.loadEnrollments();
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: err.error.message || 'Error',
          detail: err.error.error,
          life: 3000,
        });
      },
    })
  }

  resetReportForm() {
    this.reportData = {
      course_id: 0,
      reason: '',
      report_type: '',
    };
    this.showReportModal = false;
  }

}