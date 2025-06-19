import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { QuizService } from '../../../services/lesson/quiz.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-student-quiz-attempt',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    CheckboxModule,
    TextareaModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    DropdownModule
  ],
  providers: [MessageService, QuizService],
  templateUrl: './student-quiz-attempt.component.html',
  styleUrls: ['./student-quiz-attempt.component.css']
})
export class StudentQuizAttemptComponent implements OnInit {
  quizId: number | null = null;
  questions: any[] = [];
  answers: { [questionId: number]: any } = {};
  showAddQuestionModal = false;
  newQuestion = {
    quiz_id: null as number | null,
    title: '',
    question_type: 'multiple_choice',
    points: 1,
    sort_order: 0,
    is_visible: true,
    choices: [
      { content: '', is_correct: false, sort_order: 0 },
      { content: '', is_correct: false, sort_order: 1 }
    ]
  };
  questionTypes = [
    { label: 'Multiple choice', value: 'multiple_choice' },
    { label: 'True/false', value: 'true_false' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('quizId');
      this.quizId = id ? +id : null;
      if (this.quizId) {
        this.loadQuestions();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Quiz not found.',
          life: 3000
        });
        this.router.navigate(['/courses']);
      }
    });
  }

  loadQuestions() {
    if (this.quizId) {
      this.quizService.getQuestions(this.quizId).subscribe({
        next: (response) => {
          if (response.message === 'Questions retrieved successfully') {
            this.questions = response.data.map((question: any) => {
              // Initialize answers for multiple_choice and true_false
              if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
                this.answers[question.id] = this.answers[question.id] || [];
              }
              return {
                id: question.id,
                title: question.title,
                question_type: question.question_type,
                points: question.points,
                sort_order: question.sort_order,
                choices: question.choices.map((choice: any) => ({
                  id: choice.id,
                  content: choice.content,
                  is_correct: choice.is_correct,
                  sort_order: choice.sort_order
                }))
              };
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to load questions.',
            life: 3000
          });
        }
      });
    }
  }

  openAddQuestionModal() {
    // this.quizId = quiz.id;
    this.newQuestion.quiz_id = this.quizId;
    this.showAddQuestionModal = true;
  }

  resetQuestionForm() {
    this.loadQuestions();
    this.newQuestion = {
      quiz_id: this.quizId,
      title: '',
      question_type: 'multiple_choice',
      points: 1,
      sort_order: 0,
      is_visible: true,
      choices: [
        { content: '', is_correct: false, sort_order: 0 },
        { content: '', is_correct: false, sort_order: 1 }
      ]
    };
  }

  addChoice() {
    this.newQuestion.choices.push({
      content: '',
      is_correct: false,
      sort_order: this.newQuestion.choices.length
    });
  }

  removeChoice(index: number) {
    if (this.newQuestion.choices.length > 2) {
      this.newQuestion.choices.splice(index, 1);
      this.newQuestion.choices.forEach((choice, i) => choice.sort_order = i);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Câu hỏi phải có ít nhất 2 lựa chọn.',
        life: 3000,
      });
    }
  }

  createQuestion() {
    if (!this.newQuestion.title || this.newQuestion.points <= 0 ||
      this.newQuestion.choices.some(choice => !choice.content)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin hợp lệ.',
        life: 3000,
      });
      return;
    }

    if (this.newQuestion.question_type === 'multiple_choice' &&
      !this.newQuestion.choices.some(choice => choice.is_correct)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Câu hỏi trắc nghiệm phải có ít nhất một đáp án đúng.',
        life: 3000,
      });
      return;
    }

    if (this.newQuestion.quiz_id) {
      // Tạo Question
      const questionData = {
        quiz_id: this.newQuestion.quiz_id,
        title: this.newQuestion.title,
        question_type: this.newQuestion.question_type,
        points: this.newQuestion.points,
        sort_order: this.newQuestion.sort_order,
        is_visible: this.newQuestion.is_visible
      };

      this.quizService.createQuestion(questionData).subscribe({
        next: (questionResponse) => {
          const questionId = questionResponse.id;
          // Tạo từng QuestionChoice
          const choiceObservables = this.newQuestion.choices.map(choice =>
            this.quizService.createQuestionChoice({
              question_id: questionId,
              content: choice.content,
              is_correct: choice.is_correct,
              sort_order: choice.sort_order
            })
          );

          // Chờ tất cả choice được tạo
          Promise.all(choiceObservables.map(obs => obs.toPromise())).then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Câu hỏi và các lựa chọn đã được tạo thành công!',
              life: 3000,
            });
            this.showAddQuestionModal = false;
            this.resetQuestionForm();
          }).catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể tạo các lựa chọn.',
              life: 3000,
            });
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tạo câu hỏi.',
            life: 3000,
          });
        }
      });
    }
  }

  selectAnswer(questionId: number, choiceId: number, questionType: string) {
    if (questionType === 'true_false') {
      this.answers[questionId] = [choiceId];
    }
    // For multiple_choice, rely on PrimeNG's ngModel binding
    // Log for debugging
    console.log('Answers:', this.answers);
  }

  updateOpenEndedAnswer(questionId: number, event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.answers[questionId] = target.value;
    console.log('Answers:', this.answers); // Debug
  }

  submitQuiz() {
    if (!this.quizId) return;

    // Check if all questions are answered
    const unanswered = this.questions.filter(q => !this.answers[q.id] ||
      (q.question_type !== 'open_ended' && Array.isArray(this.answers[q.id]) && this.answers[q.id].length === 0) ||
      (q.question_type === 'open_ended' && typeof this.answers[q.id] === 'string' && !this.answers[q.id].trim()));
    if (unanswered.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please answer all questions.',
        life: 3000
      });
      return;
    }

    // Format submission data
    const submission = {
      quiz_id: this.quizId,
      answers: Object.keys(this.answers).map(questionId => ({
        question_id: +questionId,
        choice_ids: Array.isArray(this.answers[+questionId]) ? this.answers[+questionId] : [],
        answer_text: typeof this.answers[+questionId] === 'string' ? this.answers[+questionId] : ''
      }))
    };

    this.quizService.submitQuiz(this.quizId, submission).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Quiz submitted successfully!',
          life: 3000
        });
        this.router.navigate([`/ courses / ${this.route.snapshot.paramMap.get('courseId') || ''} `]);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to submit quiz.',
          life: 3000
        });
      }
    });
  }
}