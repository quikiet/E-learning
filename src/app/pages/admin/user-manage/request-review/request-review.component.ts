import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InstructorRequestService } from '../../../../services/instructors-manage/instructor-request.service';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { Tag } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-request-review',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    PaginatorModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    Tooltip,
    Tag,
    DialogModule,
    AvatarModule,
    TextareaModule,
    DropdownModule,
    ReactiveFormsModule,
    DrawerModule
  ],
  providers: [MessageService],
  templateUrl: './request-review.component.html',
  styleUrl: './request-review.component.css'
})
export class RequestReviewComponent implements OnInit {
  requests: any[] = [];
  currentPage: number = 1; // Trang hiện tại
  perPage: number = 10; // Số mục trên mỗi trang
  totalRecords: number = 0; // Tổng số bản ghi
  visible: boolean = false;
  displayDialog: boolean = false; // Điều khiển hiển thị dialog
  selectedRequest: any = null;
  displayReviewDialog: boolean = false; // Dialog nhập ghi chú
  reviewRequestId: number | null = null; // ID của yêu cầu đang được duyệt/từ chối
  reviewAction: string = ''; // 'approved' hoặc 'rejected'
  adminNotes: string = '';
  drawerFilter = false;
  // Biến tìm kiếm
  searchParams = {
    name: '',
    email: '',
    phone_number: '',
    organization: '',
    status: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  };

  // Tùy chọn cho dropdown
  statusOptions = [
    { label: 'Tất cả', value: '' },
    { label: 'Chờ duyệt', value: 'pending' },
    { label: 'Chấp nhận', value: 'approved' },
    { label: 'Từ chối', value: 'rejected' }
  ];
  sortByOptions = [
    { label: 'ID', value: 'id' },
    { label: 'Ngày gửi', value: 'created_at' }
  ];

  sortOrderOptions = [
    { label: 'Tăng dần', value: 'asc' },
    { label: 'Giảm dần', value: 'desc' }
  ];

  @ViewChild('tableRequest') dt!: Table;

  constructor(
    private instructorRequestsService: InstructorRequestService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.loadRequests();
  }

  reset() {
    // Reset các tham số tìm kiếm
    this.searchParams = {
      name: '',
      email: '',
      phone_number: '',
      organization: '',
      status: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    };
    this.currentPage = 1;
    this.loadRequests();
    this.clear(this.dt);
  }

  clear(table: Table) {
    table.clear();
  }

  search() {
    this.currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    this.loadRequests();
  }

  // loadRequests(page: number = this.currentPage, perPage: number = this.perPage) {
  //   this.instructorRequestsService.getPendingRequests(page, perPage).subscribe({
  //     next: (res) => {
  //       this.requests = res.data; // Danh sách yêu cầu
  //       this.currentPage = res.current_page; // Trang hiện tại
  //       this.perPage = res.per_page; // Số mục trên mỗi trang
  //       this.totalRecords = res.total; // Tổng số bản ghi
  //       console.log('Instructor requests loaded:', this.requests);
  //     },
  //     error: (err) => {
  //       console.error('Error loading instructor requests:', err.message);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Lỗi',
  //         detail: 'Không thể tải danh sách yêu cầu',
  //         life: 3000,
  //       });
  //     }
  //   });
  // }

  loadRequests() {
    const params = {
      ...this.searchParams,
      page: this.currentPage,
      per_page: this.perPage
    };
    this.instructorRequestsService.searchRequests(params).subscribe({
      next: (res) => {
        this.requests = res.data;
        this.currentPage = res.current_page;
        this.perPage = res.per_page;
        this.totalRecords = res.total;
        console.log('Instructor requests loaded:', this.requests);
      },
      error: (err) => {
        console.error('Error loading instructor requests:', err.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách yêu cầu',
          life: 3000,
        });
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // PrimeNG paginator dùng index từ 0
    this.perPage = event.rows;
    this.loadRequests();
  }

  showRequestDetails(request: any) {
    this.selectedRequest = request;
    this.displayDialog = true;
  }

  openReviewDialog(requestId: number, action: string) {
    this.reviewRequestId = requestId;
    this.reviewAction = action;
    this.adminNotes = ''; // Reset ghi chú
    this.displayReviewDialog = true;
  }

  submitReview() {
    if (!this.reviewRequestId) return;

    const data = {
      status: this.reviewAction,
      admin_notes: this.adminNotes || null
    };

    this.instructorRequestsService.reviewRequest(this.reviewRequestId, data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: this.reviewAction === 'approved' ? 'Yêu cầu đã được duyệt' : 'Yêu cầu đã bị từ chối',
          life: 3000,
        });
        this.loadRequests();
        this.displayReviewDialog = false;
        this.displayDialog = false;
        this.adminNotes = '';
      },
      error: (err) => {
        console.error(`Error ${this.reviewAction} request:`, err.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: this.reviewAction === 'approved' ? 'Không thể duyệt yêu cầu' : 'Không thể từ chối yêu cầu',
          life: 3000,
        });
      }
    });
  }


  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split('');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join('') + '...';
  }
}