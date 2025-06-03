import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-course-pending-lessons',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ToastModule,
    DialogModule
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
}