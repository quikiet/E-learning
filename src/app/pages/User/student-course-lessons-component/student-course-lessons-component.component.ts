import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses.service';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { EnrollmentService } from '../../../services/enrollments/enrollment.service';
import { AvatarModule } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../../services/auth.service';
import { QuizService } from '../../../services/lesson/quiz.service';
import { AccordionModule } from 'primeng/accordion';
import { LoadingComponent } from "../../../components/both/loading/loading.component";

interface Feedback {
  name: string;
}

@Component({
  selector: 'app-student-course-lessons-component',
  imports: [
    CommonModule,
    TagModule,
    ToastModule,
    ButtonModule,
    AvatarModule,
    Divider,
    CardModule,
    RatingModule,
    FormsModule,
    SelectModule,
    TextareaModule,
    RouterLink,
    AccordionModule,
    LoadingComponent
  ],
  providers: [MessageService],
  templateUrl: './student-course-lessons-component.component.html',
  styleUrl: './student-course-lessons-component.component.css'
})
export class StudentCourseLessonsComponentComponent implements OnInit {
  courseId: number = 0;
  course: any = null;
  lessons: any[] = [];
  quizzes: any[] = [];
  reviews: any[] = [];
  selectedLesson: any = null;
  currentLessonIndex: number = -1;
  isLoading: boolean = true;
  newRating: number = 0;
  newComment: string = '';
  feedback_type: Feedback[] | undefined;
  displayedReviews: any[] = []; // Array to hold displayed reviews
  showAll = false;
  selectedFeedback = 'content_quality';
  hasReviewed: boolean = false; // Track if user has reviewed
  currentUserId: number | null = null;
  hasMarkedComplete: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private enrollmentService: EnrollmentService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.authService.getCurrentUser().subscribe(res => {
      this.currentUserId = res.user.id;
      this.loadCourseLessons();
    });
    this.feedback_type = [
      { name: 'content_quality' },
      { name: 'instructor' },
      { name: 'platform_issue' },
      { name: 'not_interested' },
    ];

  }

  loadCourseLessons() {
    this.isLoading = true;
    this.enrollmentService.getCourseLessons(this.courseId).subscribe({
      next: (res) => {
        this.course = res.data.course;
        this.lessons = res.data.lessons;
        this.reviews = res.data.reviews;
        this.updateDisplayedReviews();
        this.checkIfUserHasReviewed();
        this.isLoading = false;

        // Chọn bài học đầu tiên nếu có
        if (this.lessons.length > 0) {
          this.selectLesson(this.lessons[0], 0);
        }
      },
      error: (err) => {
        console.error('Error loading course lessons:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message,
          life: 3000,
        });
      }, complete: () => {
        this.isLoading = false;
      }
    });
  }

  checkIfUserHasReviewed() {
    if (this.currentUserId && this.reviews.length > 0) {
      this.hasReviewed = this.reviews.some(
        (review) => review.user_id === this.currentUserId
      );
    } else {
      this.hasReviewed = false;
    }
  }

  updateDisplayedReviews() {
    this.displayedReviews = this.showAll
      ? this.reviews
      : this.reviews.slice(0, 1);
  }

  // Toggle show more/less
  toggleShowMore() {
    this.showAll = !this.showAll;
    this.updateDisplayedReviews();
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  selectLesson(lesson: any, index: number) {
    this.selectedLesson = lesson;
    if (this.selectedLesson.progress === 'not_started') {
      this.markLessonInProgress();
    }
    this.currentLessonIndex = index;
    this.hasMarkedComplete = false; // Reset when selecting new lesson
    this.loadQuizzes();
  }

  loadQuizzes() {
    this.quizService.getQuizzesOfLesson(this.selectedLesson.id).subscribe({
      next: (res) => {
        this.quizzes = res.data;
      }, error: (err) => {
        console.log(err.message);
      }
    })
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

  onVideoTimeUpdate(event: Event) {
    if (!this.selectedLesson || this.selectedLesson.completed_at || this.hasMarkedComplete) {
      return;
    }

    const video = event.target as HTMLVideoElement;
    const progress = (video.currentTime / video.duration) * 100;

    if (progress >= 90) {
      this.hasMarkedComplete = true;
      this.markLessonComplete();
    }
  }

  markLessonComplete() {
    this.enrollmentService.markLessonComplete(this.selectedLesson.id, 'completed').subscribe({
      next: (res) => {
        this.selectedLesson.completed_at = res.progress.completed_at;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        // this.loadCourseLessons();
        this.selectedLesson.progress = 'completed';
        // Tự động chuyển sang bài học tiếp theo nếu có
        // if (this.currentLessonIndex < this.lessons.length - 1) {
        //   this.selectNextLesson();
        // }
      },
      error: (err) => {
        console.error('Error marking lesson complete:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message,
          life: 3000,
        });
      }
    });
  }

  markLessonInProgress() {
    this.enrollmentService.markLessonComplete(this.selectedLesson.id, 'in_progress').subscribe({
      next: (res) => {
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: res.message,
        //   life: 3000,
        // });
        this.selectedLesson.progress = 'in_progress';

        // Tự động chuyển sang bài học tiếp theo nếu có
        // if (this.currentLessonIndex < this.lessons.length - 1) {
        //   this.selectNextLesson();
        // }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message,
          life: 3000,
        });
      }
    });
  }

  submitReview() {
    if (this.newRating === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng chọn số sao đánh giá'
      });
      return;
    }

    const reviewData = {
      rating: this.newRating,
      comment: this.newComment.trim() || null,
      feedback_type: this.selectedFeedback
    };

    // Gửi API request
    console.log('Submitting review:', reviewData);
    this.enrollmentService.reviewCourse(this.courseId, reviewData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: res.message
        });

        // Reset form
        this.newRating = 0;
        this.newComment = '';
        this.selectedFeedback = '';
        // Reload reviews
        this.loadCourseLessons();
      }, error: (err) => {
        console.log(err.message);

        this.messageService.add({
          severity: 'error',
          summary: 'Thất bại',
          detail: err.error.message
        });
      }
    })

  }

  getRatingLabel(rating: number): string {
    const labels = [''];
    return labels[rating] || '';
  }
}
