import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses.service';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { EnrollmentService } from '../../../services/enrollments/enrollment.service';
import { AvatarModule } from 'primeng/avatar';
@Component({
  selector: 'app-student-course-lessons-component',
  imports: [
    CommonModule,
    TagModule,
    ToastModule,
    ButtonModule,
    AvatarModule
  ],
  providers: [MessageService],
  templateUrl: './student-course-lessons-component.component.html',
  styleUrl: './student-course-lessons-component.component.css'
})
export class StudentCourseLessonsComponentComponent implements OnInit {
  enrollmentId: number = 0;
  course: any = null;
  lessons: any[] = [];
  selectedLesson: any = null;
  currentLessonIndex: number = -1;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private enrollmentService: EnrollmentService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.enrollmentId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCourseLessons();
  }

  loadCourseLessons() {
    this.isLoading = true;
    this.enrollmentService.getCourseLessons(this.enrollmentId).subscribe({
      next: (res) => {
        this.course = res.data.course;
        this.lessons = res.data.lessons;
        this.isLoading = false;

        // Chọn bài học đầu tiên chưa hoàn thành
        const firstIncompleteLessonIndex = this.lessons.findIndex(lesson => !lesson.completed_at);
        if (firstIncompleteLessonIndex !== -1) {
          this.selectLesson(this.lessons[firstIncompleteLessonIndex], firstIncompleteLessonIndex);
        } else if (this.lessons.length > 0) {
          this.selectLesson(this.lessons[0], 0);
        }
      },
      error: (err) => {
        console.error('Error loading course lessons:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể tải danh sách bài học. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }

  selectLesson(lesson: any, index: number) {
    if (this.canAccessLesson(lesson)) {
      this.selectedLesson = lesson;
      this.currentLessonIndex = index;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Bạn cần hoàn thành bài học trước đó để truy cập bài học này.',
        life: 3000,
      });
    }
  }

  selectPreviousLesson() {
    if (this.currentLessonIndex > 0) {
      this.selectLesson(this.lessons[this.currentLessonIndex - 1], this.currentLessonIndex - 1);
    }
  }

  selectNextLesson() {
    if (this.currentLessonIndex < this.lessons.length - 1) {
      this.selectLesson(this.lessons[this.currentLessonIndex + 1], this.currentLessonIndex + 1);
    }
  }

  canAccessLesson(lesson: any): boolean {
    if (lesson.is_preview) return true;

    const lessonIndex = this.lessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex === 0) return true;

    const previousLesson = this.lessons[lessonIndex - 1];
    return previousLesson.completed_at !== null;
  }

  canMarkComplete(lesson: any): boolean {
    return this.canAccessLesson(lesson);
  }

  markLessonComplete() {
    this.enrollmentService.markLessonComplete(this.selectedLesson.id, 'completed').subscribe({
      next: (res) => {
        this.selectedLesson.completed_at = res.progress.completed_at;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Bài học đã được đánh dấu hoàn thành.',
          life: 3000,
        });

        // Tự động chuyển sang bài học tiếp theo nếu có
        if (this.currentLessonIndex < this.lessons.length - 1) {
          this.selectNextLesson();
        }
      },
      error: (err) => {
        console.error('Error marking lesson complete:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể đánh dấu bài học hoàn thành. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }
}
