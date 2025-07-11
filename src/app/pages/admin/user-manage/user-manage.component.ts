import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Ripple } from 'primeng/ripple';
import { Button, ButtonModule } from 'primeng/button';
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
import { Tag } from 'primeng/tag';
import { UserService } from '../../../services/user-manage/user.service';
import { RouterLink } from '@angular/router';
import { Toast } from 'primeng/toast';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";

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
  selector: 'app-user-manage',
  imports: [ReactiveFormsModule, OverlayBadgeModule, Toast, RouterLink, Tag, TooltipModule, Divider, Button, PopoverModule, AccordionModule, TextareaModule, AvatarModule, DrawerModule, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, SelectModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, SelectModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, FormElementComponent],
  providers: [MessageService],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.css'
})
export class UserManageComponent implements OnInit {
  createAdminDialog: boolean = false;
  userDialog: boolean = false;
  selectedFile: File | null = null;
  users!: any[];
  deletedUsers: any = [];
  originalUser: any = {};
  user!: any;
  isEditting = false;
  selectedUsers: any[] = [];
  searchValue: string | undefined = '';
  submitted: boolean = false;
  isLoading = true;
  visibleDrawer: boolean = false;
  totalRecords: number = 0;
  rows: number = 20; // số dòng mỗi trang
  currentPage: number = 0;

  @ViewChild('tableUser') dt!: Table;
  cols!: Column[];
  exportColumns!: ExportColumn[];
  filterDialog = false;
  adminForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  filterForm = new FormGroup({
    username: new FormControl(''),
    fullname: new FormControl(''),
    email: new FormControl(''),
    role: new FormControl(''),
    gender: new FormControl(''),
    birthdate: new FormControl(''),
  });

  roleOptions = [
    { label: 'All Roles', value: '' },
    { label: 'Student', value: 'student' },
    { label: 'Instructor', value: 'instructor' },
    { label: 'Admin', value: 'admin' }
  ];

  genderOptions = [
    { label: 'All Genders', value: '' },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];


  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    if (!this.user) {
      this.visibleDrawer = false;
    }
  }

  searchGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue = value;
    this.dt.reset();
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.filterForm.reset();
    this.loadUserData();
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadUserData(event?: any) {
    const first = event?.first ?? 0;
    const rows = event?.rows ?? this.rows ?? 20;
    const page = Math.floor(first / rows) + 1;
    const filters = this.filterForm.value;

    this.userService.getAllUser(page, rows, filters).subscribe({
      next: (res) => {
        this.users = res.data.data;
        this.totalRecords = res.data.total;
        this.rows = res.data.per_page;
        this.currentPage = res.data.current_page - 1;
        this.cd.markForCheck();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user data', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users', life: 3000 });
        this.isLoading = false;
      }
    });
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'username', header: 'Username' },
      { field: 'fullname', header: 'Fullname' },
      { field: 'email', header: 'Email' },
      { field: 'birthdate', header: 'Birthdate' },
      { field: 'gender', header: 'Gender' },
      { field: 'role', header: 'Role' },
      { field: 'created_at', header: 'Created At' },
      { field: 'updated_at', header: 'Updated At' }
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  showUser(user: any) {
    this.submitted = false;
    this.visibleDrawer = true;
    this.user = { ...user };
  }

  deleteUser(userID: number) {
    this.userService.deleteUser(userID).subscribe({
      next: () => {
        this.loadUserData();
        this.visibleDrawer = false;
        this.user = null;
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xoá người dùng thành công', life: 3000 });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: err.message, life: 3000 });
        console.log(err.message);
      }
    })
  }


  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split('');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join('') + '...';
  }

  showCreateAdminDialog() {
    this.createAdminDialog = true;
    this.submitted = false;
  }

  // Create admin account
  createAdmin() {
    this.submitted = true;
    if (this.adminForm.valid) {
      const formValue = this.adminForm.value;
      this.userService.createUser({
        email: formValue.email!,
        password: formValue.password!
      }).subscribe({
        next: (res) => {
          this.createAdminDialog = false;
          this.loadUserData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Admin created successfully', life: 3000 });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: err.error.message, detail: err.error.error, life: 3000 });
        }
      });
    }
  }

  showFilterDialog() {
    this.filterDialog = true;
  }

  applyFilters() {
    this.filterDialog = false;
    this.dt.reset();
    this.loadUserData();
  }
}
