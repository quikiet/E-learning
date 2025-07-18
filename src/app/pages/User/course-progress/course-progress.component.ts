import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CoursesService } from '../../../services/courses.service';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from '../../../components/user/header/header.component';
import { LoadingComponent } from '../../../components/both/loading/loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

interface Quiz {
  quiz_id: number;
  quiz_title: string;
  score: string;
  is_passed: boolean;
  completed_at: string | null;
}

@Component({
  selector: 'app-course-progress',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    LoadingComponent,
    ProgressBarModule,
    FormsModule,
    ToastModule
  ],
  providers: [CoursesService, MessageService],
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css']
})
export class CourseProgressComponent implements OnInit {
  courseProgress: any;
  isLoading: boolean = true;
  globalFilter: string = '';
  courseId: number = 0;

  @ViewChild('dt') dt: Table | undefined;
  constructor(
    private coursesService: CoursesService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
    console.log(this.courseId);

    this.loadCourseProgress();
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dt && input) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  backListCourse() {
    this.router.navigate(['/instructor-course']);
  }

  loadCourseProgress() {
    if (this.courseId > 0) {
      this.isLoading = true;
      this.coursesService.instructorGetUserProgessCourses(this.courseId).subscribe({
        next: (res) => {
          this.courseProgress = res.data;
          this.isLoading = false;
          console.log('Course Progress:', this.courseProgress.users);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: err.error?.message,
            detail: err.error?.error,
            life: 3000
          });
        }
      });
    }
  }

  getQuizSummary(quizzes: Quiz[]): string {
    if (!quizzes?.length) return 'No quizzes';
    return quizzes
      .map((quiz) => `${quiz.quiz_title}: ${quiz.score}% (${quiz.is_passed ? 'Passed' : 'Failed'})`)
      .join(', ');
  }

  toggleCertificateEligibility(userId: number) {
    if (!this.courseProgress) return;
    this.isLoading = true;
    this.coursesService.instructorIssueCertificate(userId, this.courseId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.loadCourseProgress();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: err.error?.message,
          detail: err.error?.error,
          life: 3000
        });
      }
    });
  }
}