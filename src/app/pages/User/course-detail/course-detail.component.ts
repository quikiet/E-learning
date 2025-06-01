import { Component, OnInit } from '@angular/core';
import { Avatar, AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { Tag, TagModule } from 'primeng/tag';
import { CoursesService } from '../../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { MultiSelectModule } from 'primeng/multiselect';
// Định nghĩa interface cho bài học
interface Lesson {
  title: string;
  video_url: string;
  duration: number;
  is_preview: boolean;
  status: string;
}

// Định nghĩa interface cho tab
interface Tab {
  title: string;
  content: { [key: number]: Lesson };
  contentLength: number;
  totalDuration: number;
  value: string;
}

@Component({
  selector: 'app-course-detail',
  imports: [
    AccordionModule,
    CommonModule,
    DividerModule,
    AvatarModule,
    TagModule,
    MultiSelectModule
  ],
  providers: [MessageService],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  course: any = null;
  tabs: Tab[] = [];
  lessons: any[] = [];
  reviews: any[] = [];
  previewVideoUrl: string = '';
  isUserEnrolled: boolean = false;
  currentVideoUrl: string | null = null;
  currentUserId: number | null = null;

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.lessons = [];
    this.reviews = [];

    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUserId = res?.user.id;
        // console.log('Current user ID:', this.currentUserId);
        this.loadCourse();
      }
    });

  }

  loadCourse() {
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log(slug);
    if (slug) {
      this.coursesService.getCourseBySlug(slug).subscribe({
        next: (res) => {
          this.course = res;
          this.reviews = res.reviews || [];
          this.lessons = res.lessons || [];

          // Kiểm tra trạng thái đăng ký của người dùng
          this.isUserEnrolled = this.checkUserEnrollment(res.enrollments || []);

          // Tìm video preview
          const previewLesson = this.lessons.find(lesson => lesson.is_preview === true);
          this.previewVideoUrl = previewLesson?.video_url;

          // Tạo tabs từ danh sách bài học
          this.tabs = this.createTabsFromLessons(this.lessons);
        },
        error: (err) => {
          console.error('Error loading course:', err.message);
          this.lessons = [];
          this.reviews = [];
          this.previewVideoUrl = '';
        }
      });
    }
  }

  checkUserEnrollment(enrollments: any[]): boolean {
    if (!this.currentUserId || !enrollments?.length) return false;

    // Kiểm tra xem user_id của người dùng hiện tại có trong danh sách enrollments không
    return enrollments.some(enrollment => enrollment.user_id === this.currentUserId && enrollment.status === 'active');
  }

  createTabsFromLessons(lessons: any[]): Tab[] {
    const tabs: Tab[] = [];
    let chapterIndex = 1;
    const lessonsPerChapter = 3;

    for (let i = 0; i < lessons.length; i += lessonsPerChapter) {
      const chapterLessons = lessons.slice(i, i + lessonsPerChapter);
      const content: { [key: number]: Lesson } = {};
      chapterLessons.forEach((lesson: any, index: number) => {
        content[index + 1] = {
          title: lesson.title,
          video_url: lesson.video_url,
          duration: lesson.duration,
          is_preview: lesson.is_preview,
          status: lesson.status
        };
      });

      tabs.push({
        title: `Chương ${chapterIndex}: ${chapterLessons[0]?.title?.split(':')[0] || 'Không'}`,
        content: content,
        contentLength: chapterLessons.length,
        totalDuration: this.getTotalDuration(chapterLessons),
        value: chapterIndex.toString()
      });

      chapterIndex++;
    }

    return tabs;
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ';
  }

  getTotalDuration(lessons: any[]): number {
    return lessons.reduce((total: number, lesson: any) => total + (lesson.duration || 0), 0);
  }

  playVideo(videoUrl: string) {
    this.currentVideoUrl = videoUrl;
  }

  getStarArray(rating: number): string[] {
    const floor = Math.floor(rating); // Phần nguyên (ví dụ: 3 cho 3.7)
    const decimal = rating - floor; // Phần thập phân (0.7)
    const stars = Array(5).fill('☆');
    for (let i = 0; i < floor; i++) {
      stars[i] = '★';
    }
    if (decimal >= 0.5 && floor < 5) {
      stars[floor] = '★';
    }
    return stars;
  }

  enrollCourse() {
    if (!this.course) return;
    const paymentData = {
      amount: this.course.price,
      method: 'vnpay',
      coupon_id: null
    };

    this.coursesService.enrollCourse(this.course.id, paymentData).subscribe({
      next: (res) => {
        console.log('Enroll course response:', res);
        if (res.order?.data) {
          // Điều hướng người dùng đến URL thanh toán
          window.location.href = res.order.data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể khởi tạo thanh toán',
            life: 3000,
          });
        }
      },
      error: (err) => {
        console.error('Error enrolling course:', err);
        const errorMessage = err.error?.message || 'Không thể mua khóa học. Vui lòng thử lại.';
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: errorMessage,
          life: 3000,
        });
      }
    });
  }
}