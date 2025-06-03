import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button, ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { PopoverModule } from 'primeng/popover';
import { Divider } from 'primeng/divider';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CoursesService } from '../../../services/courses.service';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
import { Tag } from 'primeng/tag';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-pending-courses',
  imports: [TextareaModule, Tag, TooltipModule, Divider, Button, PopoverModule, AccordionModule, TextareaModule, AvatarModule, DrawerModule, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, DropdownModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, FormElementComponent],
  providers: [MessageService],
  templateUrl: './pending-courses.component.html',
  styleUrl: './pending-courses.component.css'
})
export class PendingCoursesComponent implements OnInit {
  courseDialog: boolean = false;
  selectedFile: File | null = null;
  displayDialog = false;
  courses!: any[];
  deletedCourses: any = [];
  originalCourse: any = {};
  course!: any;
  isEditting = false;
  selectedCourses: any[] = [];
  searchValue: string | undefined = '';
  submitted: boolean = false;
  isLoading = true;
  visibleDrawer: boolean = false;
  totalRecords: number = 0;
  rows: number = 10; // số dòng mỗi trang
  currentPage: number = 0;
  @ViewChild('tableCourse') dt!: Table;
  cols!: Column[];
  exportColumns!: ExportColumn[];
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
  reviewCourseId: number | null = null;
  reviewAction: string = '';
  notes: string = '';
  selectedCourse: any = null;
  displayReviewDialog = false;

  constructor(
    private courseService: CoursesService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadPendingCourses();
  }

  showRequestDetails(data: any) {
    this.selectedCourse = data;
    this.displayDialog = true;
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
      this.courseService.reviewCourse(this.reviewCourseId, data).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Duyệt thành công',
            life: 3000,
          });
          this.loadPendingCourses();
          this.displayReviewDialog = false;
          this.displayDialog = false;
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
      this.courseService.rejectCourse(this.reviewCourseId, data).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Từ chối course thành công',
            life: 3000,
          });
          this.loadPendingCourses();
          this.displayReviewDialog = false;
          this.displayDialog = false;
          this.notes = '';
        },
        error: (err) => {
          console.error(`Error ${this.reviewAction} request:`, err.message);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể từ chối yêu cầu',
            life: 3000,
          });
        }
      });
    }
  }

  searchGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue = value;
    this.dt.reset();
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadPendingCourses(event?: any) {
    const first = event?.first ?? 0;
    const rows = event?.rows ?? this.rows ?? 10;
    const page = Math.floor(first / rows) + 1;
    this.courseService.getPendingCourses(page, rows
    ).subscribe({
      next: (res) => {
        this.courses = res.data;
        console.log(this.course);

        this.totalRecords = res.total;
        this.rows = res.per_page;
        this.currentPage = res.current_page - 1;

        this.cd.markForCheck();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải dữ liệu', err);
        this.isLoading = false;
      }
    });
    this.cols = [
      { field: 'id', header: 'Mã' },
      { field: 'course_name', header: 'Tên' },
      { field: 'university', header: 'Trường' },
      { field: 'image', header: 'Hình ảnh' },
      { field: 'university', header: 'Trường' },
      { field: 'skills', header: 'Kỹ năng' },
      { field: 'course_rating', header: 'Đánh giá' },
      { field: 'course_url', header: 'URL' },
      { field: 'course_description', header: 'Mô tả' },
      { field: 'price', header: 'Giá' },
      { field: 'status', header: 'Trạng thái' },
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}