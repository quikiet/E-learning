import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CoursesService } from '../../../services/courses.service';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-admin-course-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToastModule,
    TooltipModule,
    RouterLink,
    DialogModule,
    TextareaModule,
    SelectModule,
    AvatarModule
  ],
  providers: [MessageService, CoursesService],
  templateUrl: './admin-course-management.component.html',
  styleUrls: ['./admin-course-management.component.css'],
})
export class AdminCourseManagementComponent implements OnInit {
  courses: any[] = [];
  totalRecords: number = 0;
  lastPage: number = 1;
  firstRow: number = 0;
  rows: number = 10;
  currentPage: number = 1;
  loading: boolean = false;
  filters = {
    q: '',
    status: null as string | null,
    difficulty_level: null as string | null,
    price_min: 0 as number | null,
    price_max: null as number | null,
    is_certificate_enabled: null as boolean | null,
    page: 1,
  };
  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Unavailable', value: 'unavailable' },
    { label: 'Banned', value: 'banned' },
  ];
  difficultyOptions = [
    { label: 'All Level', value: 'Unknown' },
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
  ];
  certificateOptions = [
    { label: 'All', value: null },
    { label: 'Certificate', value: 1 },
    { label: 'Non-certificate', value: 0 },
  ];

  reviewCourseId: number | null = null;
  reviewAction: string = '';
  notes: string = '';
  selectedCourse: any = null;
  displayReviewDialog = false;

  constructor(
    private coursesService: CoursesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    const params: any = { page: this.filters.page };
    if (this.filters.q) params.q = this.filters.q;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.difficulty_level) params.difficulty_level = this.filters.difficulty_level;
    if (this.filters.price_min !== null) params.price_min = this.filters.price_min;
    if (this.filters.price_max !== null) params.price_max = this.filters.price_max;
    if (this.filters.is_certificate_enabled !== null) params.is_certificate_enabled = this.filters.is_certificate_enabled;

    console.log('Search params:', params);
    this.coursesService.searchCourseAdmin(params).subscribe({
      next: (res) => {
        console.log('API Response:', {
          total: res.total,
          last_page: res.last_page,
          current_page: res.current_page,
          per_page: res.per_page,
          data_length: res.data.length,
          links: res.links,
        });
        this.courses = res.data || [];
        this.totalRecords = res.total || 0;
        this.lastPage = res.last_page || 1;
        this.rows = res.per_page || 10;
        this.currentPage = res.current_page || 1;
        this.firstRow = (this.currentPage - 1) * this.rows;
        this.loading = false;
        if (this.filters.page > this.lastPage) {
          this.filters.page = 1;
          this.currentPage = 1;
          this.firstRow = 0;
          this.loadCourses();
        }
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: err.error?.message,
          detail: err.error?.error,
          life: 3000,
        });
      },
    });
  }

  banCourse(courseId: number) {
    this.coursesService.banCourses(courseId).subscribe({
      next: (res) => {
        const userInput = prompt('Are you sure you want to ban this course? Please type "OK" to confirm.');
        if (userInput !== 'OK') {
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.loadCourses();
      }, error: (err) => {
        console.log(err.error.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000,
        });
      }
    })
  }

  unBanCourse(courseId: number) {
    this.coursesService.unBanCourses(courseId).subscribe({
      next: (res) => {
        const userInput = prompt('Are you sure you want to ban this course? Please type "OK" to confirm.');
        if (userInput !== 'OK') {
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.loadCourses();
      }, error: (err) => {
        console.log(err.error.message);
        this.messageService.add({
          severity: 'error',
          summary: err.error.message || 'Error',
          detail: err.error.error,
          life: 3000,
        });
      }
    })
  }


  openReviewDialog(courseId: number, action: string) {
    this.reviewCourseId = courseId;
    this.reviewAction = action;
    this.notes = ''; // Reset ghi chú
    this.displayReviewDialog = true;
  }

  submitReview() {
    if (!this.reviewCourseId) return;

    const data = {
      notes: this.notes || null
    };

    if (this.reviewAction === 'approved') {
      this.coursesService.reviewCourse(this.reviewCourseId, data).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Duyệt thành công',
            life: 3000,
          });
          this.loadCourses();
          this.displayReviewDialog = false;
          this.notes = '';
        },
        error: (err) => {
          console.error(`Error ${this.reviewAction} request:`, err.message);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể duyệt yêu cầu',
            life: 3000,
          });
        }
      });
    } else if (this.reviewAction === 'rejected') {
      this.coursesService.rejectCourse(this.reviewCourseId, data).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
            life: 3000,
          });
          this.loadCourses();
          this.displayReviewDialog = false;
          this.notes = '';
        },
        error: (err) => {
          console.error(`Error ${this.reviewAction} request:`, err.message);
          this.messageService.add({
            severity: 'error',
            summary: err.error.message,
            detail: err.error.error,
            life: 3000,
          });
        }
      });
    }
  }


  applyFilters() {
    this.filters.page = 1;
    this.currentPage = 1;
    this.firstRow = 0;
    this.loadCourses();
  }

  resetFilters() {
    this.filters = {
      q: '',
      status: null,
      difficulty_level: null,
      price_min: null,
      price_max: null,
      is_certificate_enabled: null,
      page: 1,
    };
    this.currentPage = 1;
    this.firstRow = 0;
    this.loadCourses();
  }

  onLazyLoad(event: any) {
    console.log('Lazy load event:', event);
    this.filters.page = Math.floor(event.first / event.rows) + 1;
    this.firstRow = event.first;
    this.rows = event.rows;
    this.currentPage = this.filters.page;
    console.log('Page changed:', { page: this.filters.page, first: this.firstRow, rows: this.rows, currentPage: this.currentPage });
    this.loadCourses();
  }

  getCategoryNames(categories: any[]): string {
    return categories.map(cat => cat.name).join(', ');
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}