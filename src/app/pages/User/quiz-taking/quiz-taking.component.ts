import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EnrollmentService } from '../../../services/enrollments/enrollment.service';
import { QuizService } from '../../../services/lesson/quiz.service';

interface Choice {
  id: number;
  question_id: number;
  content: string;
  is_correct: number;
  created_at: string;
  updated_at: string;
}

interface Question {
  id: number;
  quiz_id: number;
  title: string;
  question_type: 'true_false' | 'multiple_choice';
  created_at: string;
  updated_at: string;
  choices: Choice[];
}

interface Pagination {
  page: number;
  per_page: number;
  total: number;
}
@Component({
  selector: 'app-quiz-taking',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RadioButtonModule,
    CheckboxModule,
    ToastModule,
  ],
  providers: [MessageService, QuizService],
  templateUrl: './quiz-taking.component.html',
  styleUrl: './quiz-taking.component.css'
})
export class QuizTakingComponent implements OnInit, OnDestroy {
  quizId: number = 0;
  questions: Question[] = [];
  selectedAnswers: { [key: number]: number | number[] } = {};
  isLoading: boolean = true;
  errorMessage: string = '';
  pagination: Pagination | null = null;
  quizStart: any;
  timeLeft: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  quizResult: any;
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.quizId = +this.route.snapshot.paramMap.get('quiz_id')!;
    this.startQuiz();
    this.loadQuestions();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startQuiz() {
    this.quizService.studentStartQuiz(this.quizId).subscribe({
      next: (res) => {
        this.quizStart = res.data;
        console.log('hihi' + this.quizStart);

        this.timeLeft = this.quizStart.time_limit * 60;

        this.updateTimeDisplay();
        this.startTimer();
      }, error: (err) => {
        alert(err.error.message);
        this.router.navigate(['']);
      }
    })
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimeDisplay();
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  updateTimeDisplay() {
    this.minutes = Math.floor(this.timeLeft / 60);
    this.seconds = this.timeLeft % 60;
  }

  loadQuestions() {
    this.isLoading = true;
    this.quizService.studentGetQuestions(this.quizId).subscribe({
      next: (res) => {
        console.log(res.data);

        this.questions = res.data;
        this.pagination = res.pagination;
        this.isLoading = false;
        // Khởi tạo selectedAnswers
        this.questions.forEach((question) => {
          this.selectedAnswers[question.id] =
            question.question_type === 'multiple_choice' ? [] : 0;
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'Không thể tải câu hỏi. Vui lòng thử lại.';
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: this.errorMessage,
          life: 3000,
        });
      },
    });
  }

  hasAnswered(): boolean {
    return this.questions.every(
      (question) =>
        this.selectedAnswers[question.id] &&
        (Array.isArray(this.selectedAnswers[question.id])
          ? (this.selectedAnswers[question.id] as number[]).length > 0
          : this.selectedAnswers[question.id] !== 0)
    );
  }

  submitQuiz() {
    if (!this.quizStart) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể nộp bài vì thiếu thông tin quiz.',
        life: 3000,
      });
      return;
    }

    const answers = Object.keys(this.selectedAnswers).map((questionId) => ({
      question_id: +questionId,
      choice_ids: Array.isArray(this.selectedAnswers[+questionId])
        ? this.selectedAnswers[+questionId]
        : [this.selectedAnswers[+questionId]],
    }));

    const body = {
      quiz_result_id: this.quizStart.quiz_result_id,
      answers,
    };

    // console.log('Submitting quiz with body:', JSON.stringify(body, null, 2));
    this.quizService.submitQuiz(this.quizId, body).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Bài trắc nghiệm đã được nộp!',
          life: 3000,
        });
        clearInterval(this.timer);
        this.quizResult = res.data;
      },
      error: (err) => {
        console.error('Submit quiz error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message || 'Không thể nộp bài. Vui lòng thử lại.',
          life: 3000,
        });
      },
    });
  }
}
