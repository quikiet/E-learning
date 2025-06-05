import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { DropdownModule } from 'primeng/dropdown';
import { HttpEventType } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
interface Category {
  name: string;
  id: number;
}
@Component({
  selector: 'app-instructor-courses',
  imports: [
    CommonModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    DialogModule,
    TooltipModule,
    FormsModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './instructor-courses.component.html',
  styleUrl: './instructor-courses.component.css'
})
export class InstructorCoursesComponent implements OnInit {
  courses: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalRecords: number = 0;

  // Biến cho dialog bài học
  showLessonsDialog: boolean = false;
  selectedCourseLessons: any[] = [];
  selectedCourseId: number = 0;
  lessonsCurrentPage: number = 1;
  lessonsPerPage: number = 10;
  lessonsTotalRecords: number = 0;

  // Biến cho dialog chỉnh sửa
  showEditDialog: boolean = false;
  selectedCourse: any = null;
  course = {
    course_name: 'hehe',
    university: '',
    difficulty_level: 'Beginner',
    course_description: '',
    skills: '',
    price: 0,
    image: null as File | null,
    category_ids: [] as number[],
  };
  categories: Category[] = [];
  selectedCategories: number[] = [];

  difficultyLevels = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ];
  isSubmitting: boolean = false;
  selectedImage: File | null = null;

  // Biến cho dialog chỉnh sửa bài học
  showEditLessonDialog: boolean = false;
  selectedLesson: any = null;
  lesson = {
    title: '',
    duration: 0,
    is_preview: false,
    video: null as File | null,
  };
  isSubmittingLesson: boolean = false;
  selectedVideo: File | null = null;
  uploadProgress: number = 0;

  constructor(
    private coursesService: CoursesService,
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.loadCourses();
    this.loadCategories();
  }

  loadCategories() {
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

  getNotes(coursereview: any[]): string {
    if (!coursereview || coursereview.length === 0) return 'Không có ghi chú';
    return coursereview.map(note => note.notes).join('\n'); // Nối các ghi chú, mỗi ghi chú 1 dòng
  }

  loadCourses() {
    this.coursesService.getInstructorCourses(this.currentPage, this.perPage).subscribe({
      next: (res) => {
        this.courses = res.data;
        this.currentPage = res.current_page;
        this.perPage = res.per_page;
        this.totalRecords = res.total;

        // Lấy số lượng bài học cho từng khóa học
        this.courses.forEach(course => {
          this.loadLessonCount(course.id, course);
        });
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách khóa học. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }

  loadLessonCount(courseId: number, course: any) {
    this.coursesService.getLessonsForCourse(courseId, 1, 10).subscribe({
      next: (res) => {
        course.lessonCount = res.total; // Lấy tổng số bài học
      },
      error: (err) => {
        console.error('Error loading lesson count:', err);
        course.lessonCount = 0;
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.perPage = event.rows;
    this.loadCourses();
  }

  navigateToAddLesson(courseId: number) {
    this.router.navigate([`/them-bai-hoc/${courseId}`]);
  }


  showLessons(courseId: number) {
    this.selectedCourseId = courseId;
    this.lessonsCurrentPage = 1;
    this.loadLessons();
    this.showLessonsDialog = true;
  }

  loadLessons() {
    this.coursesService.getLessonsForCourse(this.selectedCourseId, this.lessonsCurrentPage, this.lessonsPerPage).subscribe({
      next: (res) => {
        this.selectedCourseLessons = res.data;
        this.lessonsCurrentPage = res.current_page;
        this.lessonsPerPage = res.per_page;
        this.lessonsTotalRecords = res.total;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách bài học. Vui lòng thử lại.',
          life: 3000,
        });
        this.selectedCourseLessons = [];
      }
    });
  }

  onLessonsPageChange(event: any) {
    this.lessonsCurrentPage = event.page + 1;
    this.lessonsPerPage = event.rows;
    this.loadLessons();
  }

  // Nếu cần hiển thị chi tiết bài học
  // showLessonDetails(lessonId: number) {
  //   this.coursesService.getLessonDetails(this.selectedCourseId, lessonId).subscribe({
  //     next: (res) => {
  //       // Xử lý hiển thị chi tiết bài học nếu cần
  //       console.log('Lesson details:', res);
  //     },
  //     error: (err) => {
  //       console.error('Error loading lesson details:', err);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Lỗi',
  //         detail: 'Không thể tải chi tiết bài học. Vui lòng thử lại.',
  //         life: 3000,
  //       });
  //     }
  //   });
  // }

  openEditDialog(course: any) {
    this.selectedCourse = course;

    this.course = {
      course_name: course.course_name,
      university: course.university,
      difficulty_level: course.difficulty_level,
      course_description: course.course_description,
      skills: course.skills,
      price: course.price,
      category_ids: course.categories ? course.categories.map((cat: any) => cat.id) : [],
      image: null
    };
    this.selectedCategories = [...this.course.category_ids];
    // Nếu categories chưa được tải, gọi lại loadCategories
    if (!this.categories || this.categories.length === 0) {
      this.loadCategories();
    }
    this.showEditDialog = true;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.course.image = file;
    }
  }

  updateCourse() {
    if (!this.course.course_name || this.course.course_name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng nhập tên khóa học.',
        life: 3000,
      });
      return;
    }

    if (!this.selectedCategories || this.selectedCategories.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng chọn ít nhất một danh mục.',
        life: 3000,
      });
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    console.log('course_name before append:', this.course.course_name);
    formData.append('course_name', this.course.course_name);
    formData.append('university', this.course.university);
    formData.append('difficulty_level', this.course.difficulty_level);
    formData.append('course_description', this.course.course_description);
    formData.append('skills', this.course.skills);
    formData.append('price', this.course.price.toString());
    // Gửi category_ids dưới dạng chuỗi JSON
    console.log('Sending category_ids:', this.selectedCategories); // Debug
    formData.append('category_ids', JSON.stringify(this.selectedCategories));

    if (this.course.image) {
      formData.append('image', this.course.image);
    }

    // Debug payload
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    this.coursesService.instructorUpdateCourse(this.selectedCourse.id, formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.showEditDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: res.message || 'Khóa học đã được cập nhật và đang chờ duyệt.',
          life: 3000,
        });
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error updating course:', err);
        console.error('Error response:', err.error);
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể cập nhật khóa học. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }

  openEditLessonDialog(lesson: any) {
    this.selectedLesson = lesson;
    this.lesson = {
      title: lesson.title,
      duration: lesson.duration,
      is_preview: lesson.is_preview,
      video: null,
    };
    this.selectedVideo = null;
    this.uploadProgress = 0; // Reset tiến trình upload
    this.showEditLessonDialog = true;
  }

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideo = file;
      this.lesson.video = file;
    }
  }

  updateLesson() {
    if (!this.lesson.title || this.lesson.title.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng nhập tiêu đề bài học.',
        life: 3000,
      });
      return;
    }

    if (!this.lesson.duration || this.lesson.duration <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng nhập thời lượng hợp lệ (phút).',
        life: 3000,
      });
      return;
    }

    this.isSubmittingLesson = true;
    const formData = new FormData();
    formData.append('title', this.lesson.title.trim());
    formData.append('duration', this.lesson.duration.toString());
    formData.append('is_preview', this.lesson.is_preview ? '1' : '0');

    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

    // Debug payload
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    // Gọi API với chunk upload
    this.coursesService.updateLesson(this.selectedCourseId, this.selectedLesson.id, formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.isSubmittingLesson = false;
          this.showEditLessonDialog = false;
          this.uploadProgress = 0;
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Bài học đã được cập nhật thành công.',
            life: 3000,
          });
          this.loadLessons(); // Reload danh sách bài học
        }
      },
      error: (err) => {
        console.error('Error updating lesson:', err);
        console.error('Error response:', err.error);
        this.isSubmittingLesson = false;
        this.uploadProgress = 0;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể cập nhật bài học. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }

  deleteLesson(lessonId: number) {
    if (!lessonId) {
      return;
    }
    this.coursesService.instructorDeleteLesson(lessonId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Bài học đã được xoá thành công.',
          life: 3000,
        });
      }, error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể xoá bài học. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}