import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

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
    RouterLink,
    InputIconModule,
    IconFieldModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './instructor-courses.component.html',
  styleUrl: './instructor-courses.component.css'
})
export class InstructorCoursesComponent implements OnInit {
  courses: any[] = [];
  filteredCourses: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalRecords: number = 0;
  searchKeyword: string = '';
  selectedCategory: number | null = null;

  showLessonsDialog: boolean = false;
  selectedCourseLessons: any[] = [];
  selectedCourseId: number = 0;
  lessonsCurrentPage: number = 1;
  lessonsPerPage: number = 10;
  lessonsTotalRecords: number = 0;

  showEditDialog: boolean = false;
  selectedCourse: any = null;
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

  difficultyLevels = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ];
  isSubmitting: boolean = false;
  selectedImage: File | null = null;

  showEditLessonDialog: boolean = false;
  selectedLesson: any = null;
  lesson = {
    title: '',
    duration: 0,
    is_preview: false,
    is_visible: false,
    video: null as File | null,
  };
  isSubmittingLesson: boolean = false;
  selectedVideo: File | null = null;
  uploadProgress: number = 0;
  isLoading = true;
  constructor(
    private coursesService: CoursesService,
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadCourses();
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
          summary: 'Error',
          detail: 'Unable to load categories.',
          life: 3000,
        });
      }
    });
  }

  loadCourses() {
    this.isLoading = true;
    this.coursesService.getInstructorCourses(this.currentPage, this.perPage).subscribe({
      next: (res) => {
        this.courses = res.data;
        this.filteredCourses = [...this.courses];
        this.currentPage = res.current_page;
        this.perPage = res.per_page;
        this.totalRecords = res.total;
        // this.courses.forEach(course => {
        //   if (!course.lessonCount) {
        //     this.loadLessonCount(course.id, course);
        //   }
        // });
        this.isLoading = false;
        // this.filterCourses(); // Áp dụng bộ lọc ngay sau khi tải
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading courses:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load courses.',
          life: 3000,
        });
      }, complete: () => {
        this.isLoading = false;
      }
    });
  }

  // loadLessonCount(courseId: number, course: any) {
  //   this.coursesService.getLessonsForCourse(courseId, 1, 10).subscribe({
  //     next: (res) => {
  //       // course.lessonCount = res.total;
  //       // this.filterCourses(); // Cập nhật lại filteredCourses để đảm bảo lessonCount
  //     },
  //     error: (err) => {
  //       console.error('Error loading lesson count:', err);
  //       course.lessonCount = 0;
  //     }
  //   });
  // }

  // filterCourses() {
  //   let filtered = [...this.courses];

  //   // Lọc theo từ khóa
  //   if (this.searchKeyword) {
  //     const keyword = this.searchKeyword.toLowerCase().trim();
  //     filtered = filtered.filter(course =>
  //       course.course_name?.toLowerCase().includes(keyword) ||
  //       course.skills?.toLowerCase().includes(keyword)
  //     );
  //   }

  //   // Lọc theo danh mục
  //   if (this.selectedCategory) {
  //     filtered = filtered.filter(course =>
  //       course.categories?.some((cat: Category) => cat.id === this.selectedCategory)
  //     );
  //   }

  //   this.filteredCourses = filtered;
  //   this.totalRecords = filtered.length;
  //   this.currentPage = 1; // Reset về trang đầu
  // }

  // clearFilters() {
  //   this.searchKeyword = '';
  //   this.selectedCategory = null;
  //   this.filteredCourses = [...this.courses];
  //   this.totalRecords = this.courses.length;
  //   this.currentPage = 1;
  // }

  cloneCourse(courseId: number) {
    this.isLoading = true;
    this.coursesService.cloneCourses(courseId).subscribe({
      next: (res) => {
        this.loadCourses();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.isLoading = false;
      }, error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
        this.isLoading = false;
      }
    })
  }

  publicCourse(courseId: number) {
    this.isLoading = true;
    this.coursesService.instructorPublicCourses(courseId).subscribe({
      next: (res) => {
        this.loadCourses();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.isLoading = false;
      }, error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        console.log(error.message);

        this.isLoading = false;
      }
    })
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.perPage = event.rows;
    this.loadCourses();
    // Không gọi loadCourses() để giữ filteredCourses
  }

  navigateToAddLesson(courseId: number) {
    this.router.navigate([`/add-lesson/${courseId}`]);
  }

  showLessons(courseId: number) {
    this.selectedCourseId = courseId;
    // this.lessonsCurrentPage = 1;
    this.showLessonsDialog = true;
    this.loadLessons();
  }

  loadLessons() {
    this.isLoading = true;
    this.coursesService.getLessonsForCourse(this.selectedCourseId, this.lessonsCurrentPage, this.lessonsPerPage).subscribe({
      next: (res) => {
        this.selectedCourseLessons = res.data;
        this.lessonsCurrentPage = res.current_page;
        this.lessonsPerPage = res.per_page;
        this.lessonsTotalRecords = res.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load lessons.',
          life: 3000,
        });
        this.selectedCourseLessons = [];
        this.isLoading = false;
      }, complete: () => {
        this.isLoading = false;
      }
    });
  }

  onLessonsPageChange(event: any) {
    this.lessonsCurrentPage = event.page + 1;
    this.lessonsPerPage = event.rows;
    this.loadLessons();
  }

  openEditDialog(course: any) {
    this.selectedCourse = course;
    this.course = {
      course_name: course.course_name,
      difficulty_level: course.difficulty_level,
      course_description: course.course_description,
      skills: course.skills,
      price: course.price,
      category_ids: course.categories ? course.categories.map((cat: Category) => cat.id) : [],
      image: null
    };
    this.selectedCategories = [...this.course.category_ids];
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
        summary: 'Error',
        detail: 'Please enter the course name.',
        life: 3000,
      });
      return;
    }
    if (!this.course.price || this.course.price < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid course price.',
        life: 3000,
      });
      return;
    }
    if (!this.course.difficulty_level || !['Beginner', 'Intermediate', 'Advanced'].includes(this.course.difficulty_level)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a valid difficulty level.',
        life: 3000,
      });
      return;
    }
    if (!this.selectedCategories || this.selectedCategories.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one category.',
        life: 3000,
      });
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('course_name', this.course.course_name || '');
    formData.append('difficulty_level', this.course.difficulty_level);
    formData.append('course_description', this.course.course_description ?? '');
    formData.append('skills', this.course.skills ?? '');
    formData.append('price', this.course.price.toString());
    formData.append('_method', 'PUT');
    this.selectedCategories.forEach((id, index) => {
      formData.append(`category_ids[${index}]`, id.toString());
    });
    if (this.course.image) {
      formData.append('image', this.course.image);
    }

    this.coursesService.instructorUpdateCourse(this.selectedCourse.id, formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.showEditDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Course updated successfully and pending approval.',
          life: 3000,
        });
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error updating course:', err);
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to update course.',
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
      is_visible: lesson.is_visible,
      video: null,
    };
    this.selectedVideo = null;
    this.uploadProgress = 0;
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
        summary: 'Error',
        detail: 'Please enter the lesson title.',
        life: 3000,
      });
      return;
    }
    if (!this.lesson.duration || this.lesson.duration <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid duration (minutes).',
        life: 3000,
      });
      return;
    }

    this.isSubmittingLesson = true;
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', this.lesson.title.trim());
    formData.append('duration', this.lesson.duration.toString());
    formData.append('is_preview', this.lesson.is_preview ? '1' : '0');
    formData.append('is_visible', this.lesson.is_visible ? '1' : '0');
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

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
            summary: 'Success',
            detail: 'Lesson updated successfully.',
            life: 3000,
          });
          this.loadLessons();
        }
      },
      error: (err) => {
        console.error('Error updating lesson:', err);
        this.isSubmittingLesson = false;
        this.uploadProgress = 0;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to update lesson.',
          life: 3000,
        });
      }
    });
  }

  deleteLesson(lessonId: number) {
    this.isLoading = true;
    if (!lessonId) {
      return;
    }
    this.coursesService.instructorDeleteLesson(this.selectedCourseId, lessonId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Lesson deleted successfully.',
          life: 3000,
        });
        this.isLoading = false;
        this.loadLessons();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to delete lesson.',
          life: 3000,
        });
        this.isLoading = false;
        this.loadLessons();
      }
    });
  }

  deleteCourse(courseId: number) {
    this.isLoading = true;
    if (!courseId) {
      return;
    }
    this.coursesService.instructorDeleteCourse(courseId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.loadCourses();
        this.isLoading = false;

      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message,
          life: 3000,
        });
        this.isLoading = false;
        this.loadCourses();
      }
    });
  }

  getNotes(coursereview: any[]): string {
    if (!coursereview || coursereview.length === 0) return 'No notes';
    return coursereview.map(note => note.notes).join('\n');
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }
}