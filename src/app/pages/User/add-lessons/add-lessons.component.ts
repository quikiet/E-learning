import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { CoursesService } from '../../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-add-lessons',
  imports: [
    FormsModule,
    ToastModule,
    ProgressBarModule
  ],
  providers: [MessageService],
  templateUrl: './add-lessons.component.html',
  styleUrl: './add-lessons.component.css'
})
export class AddLessonsComponent implements OnInit {
  lesson = {
    course_id: 0,
    title: '',
    video: null as File | null,
    is_preview: false,
    sort_order: 0
  };
  uploadProgress: number = 0;
  isUploading: boolean = false;

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId) {
      this.lesson.course_id = parseInt(courseId, 10);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.lesson.video = file;
    }
  }

  addLesson() {
    if (!this.lesson.video) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng chọn video bài học.',
        life: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('course_id', this.lesson.course_id.toString());
    formData.append('title', this.lesson.title);
    formData.append('video', this.lesson.video);
    formData.append('is_preview', this.lesson.is_preview ? '1' : '0');
    formData.append('sort_order', this.lesson.sort_order.toString());

    this.isUploading = true;
    this.uploadProgress = 0;

    this.coursesService.addLesson(this.lesson.course_id, formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          console.log('Progress:', this.uploadProgress);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          this.uploadProgress = 0;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Add successful',
            life: 3000,
          });

          this.lesson = {
            course_id: this.lesson.course_id,
            title: '',
            video: null,
            is_preview: false,
            sort_order: 0
          };
        }
      },
      error: (err) => {
        console.error('Error adding lesson:', err);
        this.isUploading = false;
        this.uploadProgress = 0;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể thêm bài học. Vui lòng thử lại.',
          life: 3000,
        });
      }
    });
  }
}