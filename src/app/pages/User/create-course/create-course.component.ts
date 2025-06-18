import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CoursesService } from '../../../services/courses.service';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { MultiSelectModule } from 'primeng/multiselect';

interface Category {
  name: string;
  id: number;
}

@Component({
  selector: 'app-create-course',
  imports: [
    FormsModule,
    CommonModule,
    ToastModule,
    MultiSelectModule
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
  };
  categories: Category[] = [];
  selectedCategories: number[] = [];

  constructor(
    private coursesService: CoursesService,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCategory();
  }

  loadCategory() {
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.categories = res;
        console.log('Loaded categories:', this.categories);
      },
      error: (err) => {
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
    if (this.course.image) {
      formData.append('image', this.course.image);
    }
    this.selectedCategories.forEach((id, index) => {
      formData.append(`category_ids[${index}]`, id.toString());
    });

    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    this.coursesService.createCourse(formData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Khóa học đã được gửi để chờ duyệt.',
          life: 3000,
        });
        this.course = {
          course_name: '',
          difficulty_level: 'Beginner',
          course_description: '',
          skills: '',
          price: 0,
          image: null,
          category_ids: []
        };
        this.selectedCategories = [];
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
}