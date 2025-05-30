import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview'; // Để tạo tab
import { InstructorsService } from '../../../../services/instructors.service';
@Component({
  selector: 'app-instructor-manage',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    PaginatorModule,
    TabViewModule
  ],
  providers: [MessageService],
  templateUrl: './instructor-manage.component.html',
  styleUrl: './instructor-manage.component.css'
})
export class InstructorManageComponent implements OnInit {
  instructors: any[] = [];
  trashedInstructors: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalRecords: number = 0;
  trashedCurrentPage: number = 1; // Trang hiện tại cho danh sách trashed
  trashedPerPage: number = 10; // Số mục mỗi trang cho danh sách trashed
  trashedTotalRecords: number = 0; // Tổng số bản ghi trashed
  isLoading = false;
  constructor(
    private instructorsService: InstructorsService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadInstructors();
  }

  loadInstructors(page: number = this.currentPage, perPage: number = this.perPage) {
    this.isLoading = true;
    this.instructorsService.AdminGetAllInstructors(page, perPage).subscribe({
      next: (res) => {
        this.instructors = res.data;
        this.currentPage = res.current_page;
        this.perPage = res.per_page;
        this.isLoading = false;
        this.totalRecords = res.total;
        console.log('Instructors loaded:', this.instructors);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading instructors:', err.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách giảng viên',
          life: 3000,
        });
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.perPage = event.rows;
    this.loadInstructors(this.currentPage, this.perPage);
  }
}