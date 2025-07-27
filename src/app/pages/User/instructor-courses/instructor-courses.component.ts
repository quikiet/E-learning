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
import { HttpEventType } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { PopoverModule } from 'primeng/popover';
import { DividerModule } from 'primeng/divider';
import { HeaderComponent } from '../../../components/user/header/header.component';
import { LoadingComponent } from '../../../components/both/loading/loading.component';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';

interface Category {
  name: string;
  id: number;
}

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [
    CommonModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    DialogModule,
    TooltipModule,
    FormsModule,
    MultiSelectModule,
    SelectModule,
    ButtonModule,
    RouterLink,
    InputIconModule,
    InputTextModule,
    IconFieldModule,
    PopoverModule,
    DividerModule,
    PopoverModule,
    LoadingComponent,
    DrawerModule
  ],
  providers: [MessageService, CategoryService, CoursesService],
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.css']
})
export class InstructorCoursesComponent implements OnInit {
  allCourses: any[] = [];
  courses: any[] = [];
  deletedCourses: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalRecords: number = 0;
  searchKeyword: string = '';
  selectedCategory: number | null = null;
  selectedStatus: string | null = null;
  selectedDifficultyLevel: string | null = null;

  showLessonsDialog: boolean = false;
  selectedCourseLessons: any[] = [];
  selectedCourseId: number = 0;
  lessonsCurrentPage: number = 1;
  lessonsPerPage: number = 10;
  lessonsTotalRecords: number = 0;
  openFilter = false;
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
  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Unavailable', value: 'unavailable' },
    { label: 'Draft', value: 'draft' }
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
  selectedImagePreview: string | ArrayBuffer | null = null; // New property for image preview
  constructor(
    private coursesService: CoursesService,
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadCourses();
    this.loadDeletedCourses();
  }

  loadCategories() {
    this.categoryService.getAllCategory().subscribe({
      next: (res) => {
        this.categories = res;
        console.log('Loaded categories:', this.categories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
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
    this.coursesService.getInstructorCourses().subscribe({
      next: (res) => {
        this.allCourses = res;
        this.filterCourses();
        this.isLoading = false;
        console.log('Loaded courses:', this.allCourses);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading courses:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to load courses.',
          life: 3000,
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadDeletedCourses() {
    this.isLoading = true;
    this.coursesService.instructorViewDeletedCourse().subscribe({
      next: (res) => {
        this.deletedCourses = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading deleted courses:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to load deleted courses.',
          life: 3000,
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  filterCourses() {
    let filtered = [...this.allCourses];

    // Filter by search keyword
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(course =>
        course.course_name?.toLowerCase().includes(keyword) ||
        course.skills?.toLowerCase().includes(keyword)
      );
    }

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(course =>
        course.categories?.some((cat: Category) => cat.id === this.selectedCategory)
      );
    }

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter(course => course.status === this.selectedStatus);
    }

    // Filter by difficulty level
    if (this.selectedDifficultyLevel) {
      filtered = filtered.filter(course => course.difficulty_level === this.selectedDifficultyLevel);
    }
    this.totalRecords = filtered.length;
    this.currentPage = 1; // Reset to first page on filter change
    this.courses = filtered.slice(0, this.perPage);
  }

  clearFilters() {
    this.searchKeyword = '';
    this.selectedCategory = null;
    this.selectedStatus = null;
    this.selectedDifficultyLevel = null;
    this.currentPage = 1;
    this.filterCourses();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.perPage = event.rows;
    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;

    let filtered = [...this.allCourses];

    // Apply filters
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(course =>
        course.course_name?.toLowerCase().includes(keyword) ||
        course.skills?.toLowerCase().includes(keyword)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(course =>
        course.categories?.some((cat: Category) => cat.id === this.selectedCategory)
      );
    }

    this.totalRecords = filtered.length;
    this.courses = filtered.slice(start, end);
  }

  restoreCourse(courseId: number) {
    this.isLoading = true;
    this.coursesService.instructorRestoreCourse(courseId).subscribe({
      next: (res) => {
        this.loadCourses();
        this.loadDeletedCourses();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Course restored successfully.',
          life: 3000,
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to restore course.',
          life: 3000,
        });
        this.isLoading = false;
      }
    });
  }

  toggleAvailableCourse(courseId: number, status: string) {
    this.isLoading = true;
    const request = status === 'approved'
      ? this.coursesService.instructorUnavailableCourse(courseId)
      : this.coursesService.instructorAvailableCourse(courseId);
    request.subscribe({
      next: (res) => {
        this.loadCourses();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Course availability updated.',
          life: 3000,
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to update course availability.',
          life: 3000,
        });
        this.isLoading = false;
      }
    });
  }

  cloneCourse(courseId: number) {
    this.isLoading = true;
    this.coursesService.cloneCourses(courseId).subscribe({
      next: (res) => {
        this.loadCourses();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Course cloned successfully.',
          life: 3000,
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to clone course.',
          life: 3000,
        });
        this.isLoading = false;
      }
    });
  }

  publicCourse(courseId: number) {
    this.isLoading = true;
    this.coursesService.instructorPublicCourses(courseId).subscribe({
      next: (res) => {
        this.loadCourses();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Course submitted for approval.',
          life: 3000,
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to submit course.',
          life: 3000,
        });
        this.isLoading = false;
      }
    });
  }

  navigateToAddLesson(courseId: number) {
    this.router.navigate([`/add-lesson/${courseId}`]);
  }

  navigateToUserProgress(courseId: number) {
    this.router.navigate([`/course/${courseId}/user-progress`]);
  }

  showLessons(courseId: number) {
    this.selectedCourseId = courseId;
    this.lessonsCurrentPage = 1;
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
          detail: err.error?.message || 'Unable to load lessons.',
          life: 3000,
        });
        this.selectedCourseLessons = [];
        this.isLoading = false;
      },
      complete: () => {
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
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
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
    // if (!this.course.difficulty_level || !['Beginner', 'Intermediate', 'Advanced'].includes(this.course.difficulty_level)) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Please select a valid difficulty level.',
    //     life: 3000,
    //   });
    //   return;
    // }
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
        this.selectedImagePreview = null; // Reset preview after successful update  
      },
      error: (err) => {
        console.error('Error updating course:', err);
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: err.error?.message || 'Error',
          detail: err.error?.error || 'Unable to update course.',
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
    if (!lessonId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid lesson ID.',
        life: 3000,
      });
      return;
    }

    const userInput = prompt('Are you sure you want to delete this lesson? Please type "OK" to confirm.');
    if (userInput !== 'OK') {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelled',
        detail: 'Lesson deletion cancelled.',
        life: 3000,
      });
      return;
    }

    this.isLoading = true;
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
        this.loadCourses();
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
    if (!courseId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid course ID.',
        life: 3000,
      });
      return;
    }

    const userInput = prompt('Are you sure you want to delete this course? Please type "OK" to confirm.');
    if (userInput !== 'OK') {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelled',
        detail: 'Course deletion cancelled.',
        life: 3000,
      });
      return;
    }

    this.isLoading = true;
    this.coursesService.instructorDeleteCourse(courseId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Course deleted successfully.',
          life: 3000,
        });
        this.isLoading = false;
        this.loadCourses();
        this.loadDeletedCourses();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: err.error?.message || 'Error',
          detail: err.error?.error || 'Unable to delete course.',
          life: 3000,
        });
        this.isLoading = false;
        this.loadCourses();
        this.loadDeletedCourses();
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