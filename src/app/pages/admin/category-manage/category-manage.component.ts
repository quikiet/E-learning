import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Ripple } from 'primeng/ripple';
import { Button, ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ProgressSpinner } from 'primeng/progressspinner';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { PopoverModule } from 'primeng/popover';
import { Divider } from 'primeng/divider';
import { LazyLoadEvent } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CoursesService } from '../../../services/courses.service';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
import { Tag } from 'primeng/tag';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';




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
  selector: 'app-category-manage',
  imports: [FormsModule, ConfirmPopupModule, ReactiveFormsModule, ToastModule, Tag, TooltipModule, Divider, Button, PopoverModule, AccordionModule, TextareaModule, AvatarModule, DrawerModule, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, DropdownModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, FormElementComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.css'
})
export class CategoryManageComponent implements OnInit {

  categoryDialog: boolean = false;
  selectedFile: File | null = null;
  categories!: any[];
  deletedCategory: any = [];
  originalCategory: any = {};
  category!: any;
  isEditting = false;
  selectedCategories: any[] = [];
  submitted: boolean = false;
  isLoading = true;
  visibleDrawer: boolean = false;
  totalRecords: number = 0;
  rows: number = 10; // số dòng mỗi trang
  currentPage: number = 0;
  @ViewChild('tableCourse') dt!: Table;
  cols!: Column[];
  exportColumns!: ExportColumn[];

  categoryForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required)
  });

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadCategoryData();
  }

  searchGlobal(event: any) {
    if (this.dt) {
      this.dt.filterGlobal(event.target.value, 'contains');
    }
  }

  clear(table: Table) {
    table.clear();
    this.loadCategoryData();
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      key: `delete-category-${id}`,
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn xoá?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Huỷ',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Xác nhận',
        severity: 'danger'
      },
      accept: () => {
        this.categoryService.deleteCategory(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message || 'Xoá danh mục thành công',
              life: 3000
            });
            this.loadCategoryData()
          }, error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: err.message || 'Không thể xoá danh mục',
              life: 3000
            });
          }
        });
      },
      reject: () => {
      }
    });
  }

  loadCategoryData() {
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.categories = res;
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
      { field: 'name', header: 'Tên' },
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  openNew() {
    this.category = {};
    this.submitted = false;
    this.categoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
    this.isLoading = false;
    this.isEditting = false;
    this.categoryForm.reset();
  }

  addCategory() {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.message, life: 3000 });
        }, error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: error.message, life: 3000 });
        }, complete: () => {
          this.loadCategoryData();
          this.categoryDialog = false;
        }
      })
      console.log('Form submmitted: ', this.categoryForm.value);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  editCategory(category: any) {
    this.isEditting = true;
    this.submitted = false;
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name
    });
    this.categoryDialog = true;
  }

  updateCategory() {
    this.submitted = true;
    if (this.categoryForm.valid) {
      this.isLoading = true;
      const categoryData = this.categoryForm.value;
      const id = categoryData.id ? parseInt(categoryData.id, 10) : null;
      if (id === null || isNaN(id)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Thất bại',
          detail: 'ID danh mục không hợp lệ',
          life: 3000
        });
        this.isLoading = false;
        return;
      }
      this.categoryService.updateCategory(id, categoryData).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: res.message || 'Cập nhật danh mục thành công',
            life: 3000
          });
          this.loadCategoryData();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Thất bại',
            detail: error.message || 'Không thể cập nhật danh mục',
            life: 3000
          });
        },
        complete: () => {
          this.hideDialog();
        }
      });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }




  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}