import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { QuizService } from '../../../services/lesson/quiz.service';
import { LoadingComponent } from '../../../components/both/loading/loading.component';

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

interface QuizResult {
  quiz_result_id: number;
  quiz_info: {
    id: number;
    title: string;
    total_questions: number;
    score: number;
    percentage: number;
    is_passed: boolean;
    pass_threshold: number;
    attempt_number: number;
    time_taken: number;
    completed_at: string;
  };
  results: {
    question_id: number;
    question_title: string;
    question_type: string;
    selected_choices: { id: number; content: string }[];
    correct_choices: { id: number; content: string }[];
    all_choices: { id: number; content: string; is_correct: number }[];
    is_correct: boolean;
    explanation: string;
  }[];
  summary: {
    total_questions: number;
    correct_answers: number;
    incorrect_answers: number;
    percentage: number;
    status: string;
    message: string;
  };
}

@Component({
  selector: 'app-quiz-taking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RadioButtonModule,
    CheckboxModule,
    ToastModule,
    LoadingComponent
  ],
  providers: [MessageService, QuizService],
  templateUrl: './quiz-taking.component.html',
  styleUrls: ['./quiz-taking.component.css']
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
  private timer: any;
  showResults: boolean = false;
  quizResult: QuizResult | null = null;

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
    this.isLoading = true;
    this.quizService.studentStartQuiz(this.quizId).subscribe({
      next: (res) => {
        this.quizStart = res.data;
        console.log('Quiz Start:', this.quizStart);
        this.timeLeft = this.quizStart.time_limit * 60;
        this.updateTimeDisplay();
        this.startTimer();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to start quiz.',
          life: 3000
        });
        this.router.navigate(['']);
      }
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimeDisplay();
      } else {
        clearInterval(this.timer);
        alert('Bạn đã quá thời gian làm bài!');
        this.router.navigate(['my-course']);
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
        this.questions = res.data;
        console.log('Questions:', JSON.stringify(res.data, null, 2));
        this.pagination = res.pagination;
        this.isLoading = false;
        this.questions.forEach((question) => {
          console.log(`Question ${question.id}:`, question.choices);
          this.selectedAnswers[question.id] =
            question.question_type === 'multiple_choice' ? [] : 0;
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'Unable to load questions. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage,
          life: 3000
        });
      }
    });
  }

  logSelection(questionId: number, value: any) {
    console.log(`Question ${questionId} selected:`, value);
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
        summary: 'Error',
        detail: 'Unable to submit quiz due to missing quiz information.',
        life: 3000
      });
      return;
    }

    if (!this.hasAnswered()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please answer all questions before submitting.',
        life: 3000
      });
      return;
    }

    this.isLoading = true;
    const answers = Object.keys(this.selectedAnswers)
      .filter((questionId) => {
        const answer = this.selectedAnswers[+questionId];
        return Array.isArray(answer) ? answer.length > 0 : answer !== 0;
      })
      .map((questionId) => ({
        question_id: +questionId,
        choice_ids: Array.isArray(this.selectedAnswers[+questionId])
          ? this.selectedAnswers[+questionId]
          : [this.selectedAnswers[+questionId]]
      }));

    const body = {
      quiz_result_id: this.quizStart.quiz_result_id,
      answers
    };

    console.log('Submitting quiz with body:', JSON.stringify(body, null, 2));

    this.quizService.submitQuiz(this.quizId, body).subscribe({
      next: (res) => {
        this.quizResult = res.data;
        console.log('Quiz Result:', JSON.stringify(this.quizResult, null, 2));
        this.showResults = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Quiz submitted successfully!',
          life: 3000
        });
        clearInterval(this.timer);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Submit quiz error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to submit quiz. Please try again.',
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  retryQuiz() {
    if (this.quizStart?.current_attempt < this.quizStart?.max_attempts) {
      this.showResults = false;
      this.quizResult = null;
      this.selectedAnswers = {};
      this.startQuiz();
      this.loadQuestions();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No remaining attempts.',
        life: 3000
      });
    }
  }

  goBack() {
    this.router.navigate(['/student/course', this.quizStart?.enrollment_id || '']);
  }
}