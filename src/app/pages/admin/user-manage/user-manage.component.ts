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
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
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
import { UserService } from '../../../services/user-manage/user.service';
import { RouterLink } from '@angular/router';
import { Toast } from 'primeng/toast';



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
  imports: [Toast, RouterLink, Tag, TooltipModule, Divider, Button, PopoverModule, AccordionModule, TextareaModule, AvatarModule, DrawerModule, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, SelectModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, DropdownModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, FormElementComponent],
  providers: [MessageService],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.css'
})
export class UserManageComponent implements OnInit {

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

  userForm = new FormGroup({
    id: new FormControl(''),
    userid_DI: new FormControl('', [
      Validators.required,
      Validators.maxLength(255)
    ]),
    email: new FormControl('', [
      Validators.email,
      Validators.maxLength(255)
    ]),
    password: new FormControl('', [
      Validators.minLength(6)
    ]),
    final_cc_cname_DI: new FormControl('Unknown', [
      Validators.maxLength(100)
    ]),
    LoE_DI: new FormControl('Unknown', [
      Validators.maxLength(50)
    ]),
    YoB: new FormControl(null, [
      Validators.min(1900),
      Validators.max(new Date().getFullYear())
    ]),
    gender: new FormControl('', [
      Validators.maxLength(20)
    ]),
    role: new FormControl('student', [
      Validators.required,
      Validators.pattern('student|instructor|admin')
    ])
  });


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
    this.searchValue = ''
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadUserData(event?: any) {
    const first = event?.first ?? 0;
    const rows = event?.rows ?? this.rows ?? 20;
    const page = Math.floor(first / rows) + 1;
    this.userService.getAllUser(page, rows).subscribe({
      next: (res) => {
        this.users = res.data.data;
        this.totalRecords = res.data.total;
        this.rows = res.data.per_page;
        this.currentPage = res.data.current_page - 1;

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
      { field: 'userid_DI', header: 'ID Người dùng' },
      { field: 'email', header: 'Email' },
      { field: 'final_cc_cname_DI', header: 'Quốc gia' },
      { field: 'LoE_DI', header: 'Trình độ học vấn' },
      { field: 'YoB', header: 'Năm sinh' },
      { field: 'gender', header: 'Giới tính' },
      { field: 'role', header: 'Vai trò' },
      { field: 'created_at', header: 'Ngày tạo' },
      { field: 'updated_at', header: 'Ngày cập nhật' }
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
}
