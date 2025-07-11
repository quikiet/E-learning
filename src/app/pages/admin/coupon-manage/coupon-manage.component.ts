import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
import { Tag } from 'primeng/tag';
import { CouponService } from '../../../services/coupon.service';
import { Checkbox } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';


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
  selector: 'app-coupon-manage',
  imports: [ReactiveFormsModule, DatePickerModule, FormsModule, Checkbox, Tag, TooltipModule, PopoverModule, AccordionModule, TextareaModule, AvatarModule, DrawerModule, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, SelectModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, FormElementComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './coupon-manage.component.html',
  styleUrl: './coupon-manage.component.css'
})
export class CouponManageComponent implements OnInit {
  couponDialog: boolean = false;
  selectedFile: File | null = null;
  coupons: any[] = [];
  deletedCoupons: any[] = [];
  originalCoupon: any = {};
  coupon: any;
  isEditting = false;
  selectedCoupons: any[] = [];
  submitted: boolean = false;
  isLoading = true;
  visibleDrawer: boolean = false;
  totalRecords: number = 0;
  rows: number = 10; // Số dòng mỗi trang
  currentPage: number = 0;
  @ViewChild('tableCoupon') dt!: Table;
  cols!: Column[];
  exportColumns!: ExportColumn[];
  minDate: Date | undefined;
  couponForm = new FormGroup({
    id: new FormControl(''),
    code: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    discount_type: new FormControl('', [Validators.required]),
    discount_value: new FormControl(0, [Validators.required, Validators.min(0)]),
    min_order: new FormControl(null, [Validators.min(0)]),
    start_date: new FormControl(null),
    end_date: new FormControl(null),
    usage_limit: new FormControl(null, [Validators.min(1)]),
    used_count: new FormControl(0, [Validators.min(0)]),
    is_active: new FormControl(true),
  });

  constructor(
    private couponService: CouponService, // Đổi từ CoursesService sang CouponService
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCouponData();
    this.minDate = new Date();
  }

  clear(table: Table) {
    table.clear();
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadCouponData(event?: TableLazyLoadEvent) {
    this.isLoading = true;

    const first = event?.first ?? 0;
    const rows = event?.rows ?? this.rows;
    const page = Math.floor(first / rows) + 1;

    this.couponService.getCoupon().subscribe({
      next: (res) => {
        this.coupons = res.data;
        this.totalRecords = res.total;
        this.rows = res.per_page;
        this.currentPage = res.current_page - 1;

        this.cd.markForCheck();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải dữ liệu coupon', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.message || 'Không thể tải danh sách coupon',
          life: 3000
        });
        this.isLoading = false;
      }
    });

    this.cols = [
      { field: 'id', header: 'Mã' },
      { field: 'code', header: 'Mã giảm giá' },
      { field: 'discount_type', header: 'Loại giảm giá' },
      { field: 'discount_value', header: 'Giá trị giảm' },
      { field: 'min_order', header: 'Đơn tối thiểu' },
      { field: 'start_date', header: 'Ngày bắt đầu' },
      { field: 'end_date', header: 'Ngày kết thúc' },
      { field: 'usage_limit', header: 'Giới hạn sử dụng' },
      { field: 'used_count', header: 'Số lần đã dùng' },
      { field: 'is_active', header: 'Trạng thái' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  openNew() {
    this.coupon = {};
    this.couponForm.reset();
    this.submitted = false;
    this.couponDialog = true;
    this.isEditting = false;
  }

  hideDialog() {
    this.couponDialog = false;
    this.submitted = false;
    this.isLoading = false;
  }

  addCoupon() {
    this.submitted = true;
    if (this.couponForm.valid) {
      this.isLoading = true;
      const couponData = this.couponForm.value;

      // Chuyển đổi ngày thành định dạng YYYY-MM-DD trước khi gửi API
      const formattedData = {
        ...couponData,
        start_date: couponData.start_date ? this.formatDate(couponData.start_date) : null,
        end_date: couponData.end_date ? this.formatDate(couponData.end_date) : null,
        used_count: couponData.used_count ? couponData.used_count : 0,
        is_active: couponData.is_active ? couponData.is_active : false
      };

      console.log('Coupon Data (Add):', formattedData); // Log để kiểm tra

      this.couponService.createCoupon(formattedData).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm mã giảm giá thành công',
            life: 3000
          });
          this.loadCouponData();
          this.hideDialog();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: err.message || 'Không thể thêm mã giảm giá',
            life: 3000
          });
          this.isLoading = false;
        }
      });
    } else {
      this.couponForm.markAllAsTouched();
    }
  }

  updateCoupon() {
    this.submitted = true;
    if (this.couponForm.valid) {
      this.isLoading = true;
      const couponData = this.couponForm.value;

      // Chuyển đổi ngày thành định dạng YYYY-MM-DD trước khi gửi API
      const formattedData = {
        ...couponData,
        start_date: couponData.start_date ? this.formatDate(couponData.start_date) : null,
        end_date: couponData.end_date ? this.formatDate(couponData.end_date) : null
      };

      console.log('Coupon Data (Update):', formattedData); // Log để kiểm tra

      this.couponService.updateCoupon(this.coupon.id, formattedData).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật mã giảm giá thành công',
            life: 3000
          });
          this.loadCouponData();
          this.hideDialog();
          this.isEditting = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: err.message || 'Không thể cập nhật mã giảm giá',
            life: 3000
          });
          this.isEditting = false;
          this.isLoading = false;
        }
      });
    } else {
      this.couponForm.markAllAsTouched();
    }
  }

  editCoupon(coupon: any) {
    this.coupon = { ...coupon };

    // Chuyển đổi start_date và end_date thành đối tượng Date
    const updatedCoupon = {
      ...coupon,
      start_date: coupon.start_date ? new Date(coupon.start_date) : null,
      end_date: coupon.end_date ? new Date(coupon.end_date) : null
    };

    this.couponForm.patchValue(updatedCoupon);
    this.couponDialog = true;
    this.isEditting = true;
  }

  deleteCoupon(couponId: number) {
    this.isLoading = true;
    this.couponService.deleteCoupon(couponId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xóa mã giảm giá thành công',
          life: 3000
        });
        this.loadCouponData();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.message || 'Không thể xóa mã giảm giá',
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  formatDate(date: Date | string): string | null {
    if (!date) return null;

    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (isNaN(dateObj.getTime())) return null; // Kiểm tra nếu ngày không hợp lệ

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}