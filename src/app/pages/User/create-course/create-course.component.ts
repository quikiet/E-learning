import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CoursesService } from '../../../services/courses.service';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';

interface Category {
  name: string;
  id: number;
  parent_id: number;
}

@Component({
  selector: 'app-create-course',
  imports: [
    FormsModule,
    ToastModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    TextareaModule,
    DividerModule,
    SelectModule
],
  providers: [MessageService],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})


export class CreateCourseComponent implements OnInit {
  course = {
    course_name: '',
    difficulty_level: 'Beginner',
    course_description: '',
    skills: '',
    price: 0,
    image: null as File | null,
    category_ids: [] as number[],
    is_certificate_enabled: false,
  };
  categories: Category[] = [];
  selectedCategories: number[] = [];
  CertiFormData = new FormData();
  isLoading = false;
  createCertificate = false;
  showCertificateModal = false;
  certificateRule = {
    course_id: null as number | null,
    lesson_completion_percent: 0,
    lesson_version_rule: 'latest',
    quiz_min_score: 0,
    quiz_version_rule: 'any',
  };

  versionRuleOptions = [
    { label: 'Latest', value: 'latest' },
    { label: 'Any', value: 'any' },
  ];

  currentUser: any = {};

  constructor(
    private coursesService: CoursesService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadCategory();
    this.checkUserRole();
  }

  checkUserRole() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res.user;
        if (this.currentUser && this.currentUser.role !== 'instructor') {
          // this.router.navigate(['/instructor-course']);
          this.router.navigate(['/instructor-request']);
        }
      }, error: (err) => {
        console.log(err.error.message);
      }
    })
  }

  loadCategory() {
    this.isLoading = true;
    this.categoryService.getAllCategory().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.categories = res;
        console.log('Loaded categories:', this.categories);
      },
      error: (err) => {
        this.isLoading = false;
        console.log('Error loading categories:', err.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách danh mục. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.course.image = file;
    }
  }

  onCategoryChange(event: any) {
    console.log('Selected categories:', this.selectedCategories);
  }

  openCertify() {
    this.showCertificateModal = !this.showCertificateModal;
    if (this.showCertificateModal === true) {
      this.createCertificate = true;
    } else {
      this.createCertificate = false;
    }
  }

  createCourse() {
    if (!this.selectedCategories || this.selectedCategories.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng chọn ít nhất một danh mục.',
        life: 3000,
      });
      return;
    }

    console.log('Sending category_ids:', this.selectedCategories);

    const formData = new FormData();
    formData.append('course_name', this.course.course_name);
    formData.append('difficulty_level', this.course.difficulty_level || '');
    formData.append('course_description', this.course.course_description || '');
    formData.append('skills', this.course.skills || '');
    formData.append('price', this.course.price.toString());
    formData.append('is_certificate_enabled', this.course.is_certificate_enabled ? '1' : '0');
    if (this.course.image) {
      formData.append('image', this.course.image);
    }
    this.selectedCategories.forEach((id, index) => {
      formData.append(`category_ids[${index}]`, id.toString());
    });

    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }


    this.CertiFormData.append('lesson_completion_percent', this.certificateRule.lesson_completion_percent.toString());
    this.CertiFormData.append('lesson_version_rule', this.certificateRule.lesson_version_rule);
    this.CertiFormData.append('quiz_min_score', this.certificateRule.quiz_min_score.toString());
    this.CertiFormData.append('quiz_version_rule', this.certificateRule.quiz_version_rule);

    this.coursesService.createCourse(formData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.certificateRule.course_id = res.course.id; // Lấy course_id từ response

        if (this.createCertificate) {
          this.createCertificateRule();
        } else {
          this.router.navigate(['/instructor-course']);
        }
      },
      error: (err) => {
        console.error('Error creating course:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể gửi khóa học. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }

  createCertificateRule() {
    if (!this.certificateRule.course_id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Thiếu course_id.',
        life: 3000,
      });
      return;
    }

    this.CertiFormData.append('course_id', this.certificateRule.course_id.toString());

    console.log('Certificate Rule Body:', Object.fromEntries(this.CertiFormData));
    this.coursesService.createCertifyRule(this.CertiFormData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.showCertificateModal = false;
        this.router.navigate(['/instructor-course']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể tạo quy tắc chứng chỉ.',
          life: 3000,
        });
      },
    });
  }

  // resetCourseForm() {
  //   this.course = {
  //     course_name: '',
  //     difficulty_level: 'Beginner',
  //     course_description: '',
  //     skills: '',
  //     price: 0,
  //     image: null,
  //     category_ids: [],
  //     is_certificate_enabled: false
  //   };
  //   this.selectedCategories = [];
  //   this.createCertificate = false;
  // }

  // resetCertificateForm() {
  //   this.certificateRule = {
  //     course_id: null,
  //     lesson_completion_percent: 85,
  //     lesson_version_rule: 'latest',
  //     quiz_min_score: 70,
  //     quiz_version_rule: 'any',
  //   };
  //   this.showCertificateModal = false;
  // }

}