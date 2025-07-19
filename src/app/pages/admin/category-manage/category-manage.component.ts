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
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
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
  imports: [FormsModule, ConfirmPopupModule, ReactiveFormsModule, ToastModule, TooltipModule, Button, PopoverModule, AccordionModule, TextareaModule, AvatarModule, DrawerModule, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, SelectModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, FormElementComponent],
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
  parentCategories: { label: string, value: number | null }[] = [];
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
    name: new FormControl('', Validators.required),
    parent_id: new FormControl<number | null>(null)
  });


  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadCategoryData();
    this.cols = [
      { field: 'id', header: 'ID' }, // Mã
      { field: 'name', header: 'Name' }, // Tên
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field
    }));

  }

  expandedRows = {};

  collapseAll() {
    this.expandedRows = {};
  }

  searchGlobal(event: any) {
    if (this.dt) {
      this.dt.filterGlobal(event.target.value, 'contains');
    }
  }
  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      key: `delete-category-${id}`,
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete??',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Accept',
        severity: 'danger'
      },
      accept: () => {
        this.categoryService.deleteCategory(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
              life: 3000
            });
            this.loadCategoryData()
          }, error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: err.error.message || 'error',
              detail: err.error.error,
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
    this.isLoading = true;
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.categories = res;
        this.parentCategories = [
          { label: 'None', value: null }, // Không có danh mục cha
          ...res.map((cat: any) => ({ label: cat.name, value: cat.id }))
        ];
        this.cd.markForCheck();
        this.isLoading = false;
        this.totalRecords = res.length;
      },
      error: (err) => {
        console.error('Lỗi tải dữ liệu', err);
        this.isLoading = false;
      }
    });
  }

  openNew() {
    this.category = {};
    this.submitted = false;
    this.isEditting = false;
    this.categoryForm.reset();
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
      this.isLoading = true;
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message || 'Category created successfully', // Thêm danh mục thành công
            life: 3000
          });
          this.loadCategoryData();
          this.hideDialog();
        }, error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Unable to create category', // Không thể thêm danh mục
            life: 3000
          });
          this.isLoading = false;
        }
      })
      // console.log('Form submmitted: ', this.categoryForm.value);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  editCategory(category: any) {
    this.isEditting = true;
    this.submitted = false;
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      parent_id: category.parent_id || null
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
          summary: 'Error',
          detail: 'Invalid category ID', // ID danh mục không hợp lệ
          life: 3000
        });
        this.isLoading = false;
        return;
      }
      this.categoryService.updateCategory(id, categoryData).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message || 'Category updated successfully', // Cập nhật danh mục thành công
            life: 3000
          });
          this.loadCategoryData();
          this.hideDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Unable to update category', // Không thể cập nhật danh mục
            life: 3000
          });
          this.isLoading = false;
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