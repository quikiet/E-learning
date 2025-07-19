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
import { FormElementComponent } from '../../../components/both/form-element/form-element.component';
import { Tag } from 'primeng/tag';
import { CouponService } from '../../../services/coupon.service';
import { Checkbox } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { ActivatedRoute, Router } from '@angular/router';

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
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePickerModule,
    FormsModule,
    Checkbox,
    Tag,
    TooltipModule,
    PopoverModule,
    AccordionModule,
    TextareaModule,
    AvatarModule,
    DrawerModule,
    InputGroupModule,
    InputGroupAddonModule,
    ConfirmDialogModule,
    ButtonModule,
    TableModule,
    DialogModule,
    SelectModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    SelectModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    FormElementComponent
  ],
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
  isEditing: boolean = false;
  selectedCoupons: any[] = [];
  submitted: boolean = false;
  isLoading: boolean = true;
  visibleDrawer: boolean = false;
  totalRecords: number = 0;
  rows: number = 10; // Rows per page
  currentPage: number = 0;
  @ViewChild('tableCoupon') dt!: Table;
  cols!: Column[];
  exportColumns!: ExportColumn[];
  minDate: Date | undefined;

  couponForm = new FormGroup({
    course_id: new FormControl(''),
    code: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    discount_type: new FormControl('', [Validators.required]),
    discount_value: new FormControl(0, [Validators.required, Validators.min(0)]),
    min_order: new FormControl(0, [Validators.min(0)]),
    start_date: new FormControl(new Date(), [Validators.required]),
    end_date: new FormControl(new Date(), [Validators.required]),
    usage_limit: new FormControl(1, [Validators.required, Validators.min(1)]),
    is_active: new FormControl(true),
  });

  currentCourseId: number = 0;

  constructor(
    private couponService: CouponService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseID');
    if (courseId) {
      this.currentCourseId = parseInt(courseId, 10);
      this.loadCouponData();
    }
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

    this.couponService.getCoupon(this.currentCourseId).subscribe({
      next: (res) => {
        this.coupons = res.data;
        console.log(this.coupons);

        this.totalRecords = res.total;
        this.rows = res.per_page;
        this.currentPage = res.current_page - 1;

        this.cd.markForCheck();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading coupon data', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Unable to load coupon list',
          life: 3000
        });
        this.isLoading = false;
      }
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'code', header: 'Coupon Code' },
      { field: 'discount_type', header: 'Discount Type' },
      { field: 'discount_value', header: 'Discount Value' },
      { field: 'min_order', header: 'Minimum Order' },
      { field: 'start_date', header: 'Start Date' },
      { field: 'end_date', header: 'End Date' },
      { field: 'usage_limit', header: 'Usage Limit' },
      { field: 'used_count', header: 'Times Used' },
      { field: 'is_active', header: 'Status' },
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
    this.isEditing = false;
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

      // Convert dates to YYYY-MM-DD format before sending to API
      const formattedData = {
        ...couponData,
        course_id: this.currentCourseId,
        start_date: couponData.start_date ? this.formatDate(couponData.start_date) : null,
        end_date: couponData.end_date ? this.formatDate(couponData.end_date) : null,
        // is_active: couponData.is_active ? couponData.is_active : false
      };

      console.log('Coupon Data (Add):', formattedData); // Log for debugging

      this.couponService.createCoupon(formattedData).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message || 'Coupon added successfully',
            life: 3000
          });
          this.loadCouponData();
          this.hideDialog();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err.error.message || 'Error',
            detail: err.error.error || 'Unable to add coupon',
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

      // Convert dates to YYYY-MM-DD format before sending to API
      const formattedData = {
        ...couponData,
        course_id: this.currentCourseId,
        start_date: couponData.start_date ? this.formatDate(couponData.start_date) : null,
        end_date: couponData.end_date ? this.formatDate(couponData.end_date) : null
      };

      console.log('Coupon Data (Update):', formattedData); // Log for debugging

      this.couponService.updateCoupon(this.coupon.id, formattedData).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message || 'Coupon updated successfully',
            life: 3000
          });
          this.loadCouponData();
          this.hideDialog();
          this.isEditing = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err.error.message || 'Error',
            detail: err.error.error || 'Unable to update coupon',
            life: 3000
          });
          this.isLoading = false;
        }
      });
    } else {
      this.couponForm.markAllAsTouched();
    }
  }

  editCoupon(coupon: any) {
    this.coupon = { ...coupon };
    // Convert start_date and end_date to Date objects
    const updatedCoupon = {
      ...coupon,
      start_date: coupon.start_date ? new Date(coupon.start_date) : null,
      end_date: coupon.end_date ? new Date(coupon.end_date) : null
    };
    this.couponForm.patchValue(updatedCoupon);
    this.couponDialog = true;
    this.isEditing = true;
    this.cd.detectChanges();
  }

  deleteCoupon(couponId: number) {
    this.isLoading = true;
    this.couponService.deleteCoupon(couponId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Coupon deleted successfully',
          life: 3000
        });
        this.loadCouponData();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: err.error.message || 'Error',
          detail: err.error.error || 'Unable to delete coupon',
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

    if (isNaN(dateObj.getTime())) return null; // Check if date is invalid

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}