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
@Component({
  selector: 'app-instructor-courses',
  imports: [
    CommonModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    DialogModule,
    TooltipModule
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

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCourses();
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
}