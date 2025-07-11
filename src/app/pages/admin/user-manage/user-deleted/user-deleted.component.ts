import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../../services/user-manage/user.service';
import { Toast, ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';

interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-user-deleted',
  imports: [Tag, Toast, AvatarModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, SelectModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule],
  providers: [MessageService],
  templateUrl: './user-deleted.component.html',
  styleUrl: './user-deleted.component.css'
})
export class UserDeletedComponent implements OnInit {
  users: any[] = [];
  selectedUsers: any[] = [];
  searchValue: string = '';
  isLoading = false;
  totalRecords: number = 0;
  rows: number = 20;
  cols: Column[] = [];

  @ViewChild('tableUserDeleted') dt!: Table;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'Mã' },
      { field: 'username', header: 'Tên người dùng' },
      { field: 'email', header: 'Email' },
      { field: 'final_cc_cname_DI', header: 'Quốc gia' },
      { field: 'LoE_DI', header: 'Trình độ học vấn' },
      { field: 'YoB', header: 'Năm sinh' },
      { field: 'gender', header: 'Giới tính' },
      { field: 'role', header: 'Vai trò' },
      { field: 'deleted_at', header: 'Ngày xóa' }
    ];

    this.loadDeletedUsers();
  }

  searchGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue = value;
  }

  clear(table: Table) {
    table.clear();
    this.loadDeletedUsers();
  }

  loadDeletedUsers(event?: TableLazyLoadEvent) {
    this.isLoading = true;

    const first = event?.first ?? 0;
    const rows = event?.rows ?? this.rows;
    const page = Math.floor(first / rows) + 1;

    this.userService.showUserDeleted(page, rows).subscribe({
      next: (res) => {
        this.users = res.data.data || [];
        this.totalRecords = res.data.total || 0;
        this.rows = res.data.per_page || rows;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.message || 'Không thể tải danh sách người dùng đã xóa',
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  restoreUser(userId: number) {
    this.userService.restoreDeleteUser(userId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Khôi phục người dùng thành công',
          life: 3000
        });
        this.loadDeletedUsers(); // Tải lại danh sách sau khi khôi phục
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.message || 'Không thể khôi phục người dùng',
          life: 3000
        });
      }
    });
  }

  forceDeleteUser(userId: number) {
    this.userService.forceDeleteUser(userId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xoá vĩnh viễn người dùng thành công',
          life: 3000
        });
        this.loadDeletedUsers(); // Tải lại danh sách sau khi khôi phục
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.message || 'Xoá vĩnh viễn khôi phục người dùng',
          life: 3000
        });
      }
    });
  }
}
