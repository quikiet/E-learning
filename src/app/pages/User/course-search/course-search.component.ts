import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { CoursesService } from '../../../services/courses.service';
import { CourseSearchSidebarComponent } from "../../../components/both/course-search-sidebar/course-search-sidebar.component";
import { ProgressSpinner } from 'primeng/progressspinner';
import { Toast } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Divider } from 'primeng/divider';
import { Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-course-search',
  imports: [
    CourseSearchSidebarComponent,
    ProgressSpinner,
    Toast,
    TableModule,
    PaginatorModule,
    CommonModule,
    Drawer,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './course-search.component.html',
  styleUrl: './course-search.component.css',
  providers: [MessageService]
})
export class CourseSearchComponent implements OnInit {
  courses: any[] = [];
  isLoading = false;
  totalRecords: number = 0;
  rows: number = 10;
  currentPage: number = 1;
  currentSearchParams: any = {
    keyword: null,
    categories: null,
    difficulty: null,
    min_rating: null,
    min_price: null,
    max_price: null,
    sort_by: 'course_rating',
    sort_order: 'desc',
    per_page: 10
  };
  visibleFilter: boolean = false;
  constructor(
    private coursesService: CoursesService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Khởi tạo từ URL params một lần duy nhất
    this.route.queryParams.subscribe((params) => {
      // Cập nhật currentSearchParams từ URL
      this.currentSearchParams = {
        keyword: params['keyword'] || null,
        categories: params['categories'] ? params['categories'].split(',').map(Number) : null,
        difficulty: params['difficulty'] || null,
        instructor_id: params['instructor_id'] || null,
        min_rating: params['min_rating'] || null,
        min_price: params['min_price'] || null,
        max_price: params['max_price'] || null,
        sort_by: params['sort_by'] || 'course_rating',
        sort_order: params['sort_order'] || 'desc',
        per_page: this.rows
      };

      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 1;

      // Load courses với params từ URL
      this.loadCourses();
    });
  }

  onSearch(params: any) {
    this.currentSearchParams = { ...params };
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadCourses();
  }

  onReset() {
    // console.log('onReset called'); // Debug log
    this.currentSearchParams = {
      keyword: null,
      categories: null,
      difficulty: null,
      instructor_id: null,
      min_rating: null,
      min_price: null,
      max_price: null,
      sort_by: 'course_rating',
      sort_order: 'desc',
      // per_page: 10,
      page: 1,
    };
    this.currentPage = 1;

    // Clear URL params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });

    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    // console.log('Loading courses with params:', this.currentSearchParams); // Debug log

    const params = {
      ...this.currentSearchParams,
      page: this.currentPage,
      per_page: this.rows
    };

    // Loại bỏ các params null/undefined trước khi gửi
    // const cleanParams = Object.fromEntries(
    //   Object.entries(params).filter(([_, value]) => value != null && value !== '')
    // );

    // console.log('Clean params sent to API:', cleanParams); // Debug log

    this.coursesService.searchCourses(params).subscribe({
      next: (res) => {
        // console.log('API Response:', res); // Debug log
        this.courses = res.data.data || [];
        this.totalRecords = res.data.total || 0;
        this.rows = res.data.per_page || this.rows;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: err.error.message,
          detail: err.error.error,
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.courses = [];
    this.updateUrlParams();
    this.loadCourses();
  }

  updateUrlParams() {
    const queryParams = {
      ...this.currentSearchParams,
      categories: this.currentSearchParams.categories ? this.currentSearchParams.categories.join(',') : null,
      page: this.currentPage
    };

    // const cleanedParams = Object.fromEntries(
    //   Object.entries(queryParams).filter(([_, value]) => value != null && value !== '')
    // );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  getStarArray(rating: number): string[] {
    const floor = Math.floor(rating); // Phần nguyên (ví dụ: 3 cho 3.7)
    const decimal = rating - floor; // Phần thập phân (0.7)
    const stars = Array(5).fill('☆');
    for (let i = 0; i < floor; i++) {
      stars[i] = '★';
    }
    if (decimal >= 0.5 && floor < 5) {
      stars[floor] = '★';
    }
    return stars;
  }

  cutText(text: string, wordLimit: number = 20): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}