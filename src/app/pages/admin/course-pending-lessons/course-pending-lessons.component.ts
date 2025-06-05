import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LessonService } from '../../../services/lesson/lesson.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'app-course-pending-lessons',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ToastModule,
    DialogModule,
    RouterLink,
    ButtonModule,
    TooltipModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule
  ],
  providers: [MessageService],
  templateUrl: './course-pending-lessons.component.html',
  styleUrl: './course-pending-lessons.component.css'
})
export class CoursePendingLessonsComponent implements OnInit {
  courseId: number = 0;
  lessons: any[] = [];
  isLoading: boolean = true;
  showVideoDialog: boolean = false;
  selectedVideoUrl: string = '';

  constructor(
    private coursesService: CoursesService,
    private lessonService: LessonService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId) {
      this.courseId = parseInt(courseId, 10);
      this.loadPendingLessons();
    }
  }

  onFilter(event: Event, dt: Table) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value;
      dt.filterGlobal(value, 'contains');
    }
  }

  loadPendingLessons() {
    this.isLoading = true;
    this.coursesService.getPendingLessonsForCourse(this.courseId).subscribe({
      next: (res) => {
        this.lessons = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending lessons:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách bài học. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }

  viewVideo(videoUrl: string) {
    this.selectedVideoUrl = videoUrl;
    this.showVideoDialog = true;
  }

  reviewLesson(lessonId: number, status: string) {
    const isConfirmed = confirm('Bạn có chắc chắn muốn duyệt bài học này không?');
    if (isConfirmed) {
      this.lessonService.adminReviewLesson(lessonId, status).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: res.message || 'Bài học đã được duyệt',
            life: 3000,
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: err.message || 'Không thể duyệt bài học. Vui lòng thử lại.',
            life: 3000,
          });
        }
      });
    }
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}