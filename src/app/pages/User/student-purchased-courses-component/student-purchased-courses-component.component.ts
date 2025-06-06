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


@Component({
  selector: 'app-student-purchased-courses-component',
  imports: [
    CommonModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    RouterLink,
    ProgressBarModule
  ],
  providers: [MessageService],
  templateUrl: './student-purchased-courses-component.component.html',
  styleUrl: './student-purchased-courses-component.component.css'
})
export class StudentPurchasedCoursesComponentComponent implements OnInit {
  enrollments: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalRecords: number = 0;
  isLoading: boolean = true;
  showDetailsDialog: boolean = false;
  selectedEnrollment: any = null;
  progressData: { [key: number]: any } = {};

  constructor(
    private enrollmentService: EnrollmentService,
    private messageService: MessageService,
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

        this.enrollments.forEach(enrollment => {
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
      }
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
