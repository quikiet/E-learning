import { Component, OnInit } from '@angular/core';

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
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-student-quiz-attempt',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    CheckboxModule,
    TextareaModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    SelectModule
  ],
  providers: [MessageService, QuizService],
  templateUrl: './student-quiz-attempt.component.html',
  styleUrls: ['./student-quiz-attempt.component.css'],
})
export class StudentQuizAttemptComponent implements OnInit {
  quizId: number | null = null;
  questions: any[] = [];
  answers: { [questionId: number]: any } = {};
  showEditQuestionModal = false;
  editQuestion: {
    quiz_id: number | null;
    id: number | null;
    title: string;
    question_type: string;
    choices: { id?: number; content: string; is_correct: boolean }[];
  } = {
      quiz_id: null,
      id: null,
      title: '',
      question_type: 'multiple_choice',
      choices: [],
    };
  questionTypes = [
    { label: 'Multiple choice', value: 'multiple_choice' },
    { label: 'True/false', value: 'true_false' },
  ];
  originalChoices: { id?: number; content: string; is_correct: boolean }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('quizId');
      this.quizId = id ? +id : null;
      if (this.quizId) {
        this.loadQuestions();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không tìm thấy quiz.',
          life: 3000,
        });
        this.router.navigate(['/courses']);
      }
    });
  }

  loadQuestions() {
    if (this.quizId) {
      this.quizService.getQuestions(this.quizId).subscribe({
        next: (response) => {

          this.questions = response.data.map((question: any) => {
            if (
              question.question_type === 'multiple_choice' ||
              question.question_type === 'true_false'
            ) {
              this.answers[question.id] = this.answers[question.id] || [];
            }
            return {
              id: question.id,
              title: question.title,
              question_type: question.question_type,
              choices: question.choices.map((choice: any) => ({
                id: choice.id,
                content: choice.content || '',
                is_correct: choice.is_correct ?? false,
              })),
            };
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải câu hỏi.',
            life: 3000,
          });
        },
      });
    }
  }


  openEditQuestionModal(question: any) {
    this.originalChoices = question.choices.map((choice: any) => ({
      id: choice.id,
      content: choice.content || '',
      is_correct: choice.is_correct ?? false,
    }));
    this.editQuestion = {
      quiz_id: this.quizId,
      id: question.id,
      title: question.title || '',
      question_type: question.question_type || 'multiple_choice',
      choices: question.choices.map((choice: any) => ({
        id: choice.id,
        content: choice.content || '',
        is_correct: choice.is_correct === 1 ? true : false,
      })),
    };
    this.showEditQuestionModal = true;
  }

  updateQuestion() {
    if (!this.editQuestion.id || !this.editQuestion.quiz_id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không tìm thấy ID câu hỏi hoặc quiz',
        life: 3000,
      });
      return;
    }

    if (this.isUpdateButtonDisabled()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin hợp lệ.',
        life: 3000,
      });
      return;
    }

    if (
      this.editQuestion.question_type === 'multiple_choice' &&
      !this.editQuestion.choices.some((choice) => choice.is_correct)
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Câu hỏi trắc nghiệm phải có ít nhất một đáp án đúng.',
        life: 3000,
      });
      return;
    }

    // Dữ liệu câu hỏi
    const questionData = {
      quiz_id: this.editQuestion.quiz_id,
      title: this.editQuestion.title,
      question_type: this.editQuestion.question_type,
    };

    // Cập nhật câu hỏi
    this.quizService.updateQuestion(this.editQuestion.id, questionData).subscribe({
      next: () => {
        // Xử lý choices: so sánh với originalChoices để xác định thêm/cập nhật/xóa
        const choiceOperations: Promise<any>[] = [];

        // Lựa chọn đã xóa
        const currentChoiceIds = this.editQuestion.choices
          .map((choice) => choice.id)
          .filter((id): id is number => id !== undefined);
        const originalChoiceIds = this.originalChoices
          .map((choice) => choice.id)
          .filter((id): id is number => id !== undefined);
        const deletedChoiceIds = originalChoiceIds.filter(
          (id) => !currentChoiceIds.includes(id)
        );

        deletedChoiceIds.forEach((choiceId) => {
          choiceOperations.push(
            this.quizService.deleteQuestionChoice(choiceId).toPromise()
          );
        });

        // Lựa chọn thêm hoặc cập nhật
        this.editQuestion.choices.forEach((choice) => {
          const choiceData = {
            question_id: this.editQuestion.id!,
            content: choice.content,
            is_correct: choice.is_correct,
          };
          if (choice.id) {
            // Cập nhật choice hiện có
            choiceOperations.push(
              this.quizService.updateQuestionChoice(choice.id, choiceData).toPromise()
            );
          } else {
            // Thêm choice mới
            choiceOperations.push(
              this.quizService.createQuestionChoice(choiceData).toPromise()
            );
          }
        });

        // Chờ tất cả choice được xử lý
        Promise.all(choiceOperations)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật câu hỏi và các lựa chọn thành công!',
              life: 3000,
            });
            this.showEditQuestionModal = false;
            this.loadQuestions();
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể cập nhật các lựa chọn.',
              life: 3000,
            });
          });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.message || 'Không thể cập nhật câu hỏi',
          life: 3000,
        });
      },
    });
  }

  resetQuestionForm() {
    this.editQuestion = {
      quiz_id: this.quizId,
      id: null,
      title: '',
      question_type: 'multiple_choice',
      choices: [],
    };
    this.originalChoices = [];
    this.showEditQuestionModal = false;
  }

  removeChoice(index: number) {
    if (this.editQuestion.choices.length > 2) {
      this.editQuestion.choices.splice(index, 1);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Câu hỏi phải có ít nhất 2 lựa chọn.',
        life: 3000,
      });
    }
  }

  isUpdateButtonDisabled(): boolean {
    return (
      !this.editQuestion.title ||
      this.editQuestion.choices.length < 2 ||
      this.editQuestion.choices.some((choice) => !choice.content)
    );
  }

  selectAnswer(questionId: number, choiceId: number, questionType: string) {
    if (questionType === 'true_false') {
      this.answers[questionId] = [choiceId];
    }
    console.log('Answers:', this.answers);
  }

  submitQuiz() {
    if (!this.quizId) return;

    const unanswered = this.questions.filter(
      (q) =>
        !this.answers[q.id] ||
        (q.question_type !== 'open_ended' &&
          Array.isArray(this.answers[q.id]) &&
          this.answers[q.id].length === 0) ||
        (q.question_type === 'open_ended' &&
          typeof this.answers[q.id] === 'string' &&
          !this.answers[q.id].trim())
    );
    if (unanswered.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng trả lời tất cả câu hỏi.',
        life: 3000,
      });
      return;
    }

    const submission = {
      quiz_id: this.quizId,
      answers: Object.keys(this.answers).map((questionId) => ({
        question_id: +questionId,
        choice_ids: Array.isArray(this.answers[+questionId])
          ? this.answers[+questionId]
          : [],
        answer_text: typeof this.answers[+questionId] === 'string' ? this.answers[+questionId] : '',
      })),
    };

    this.quizService.submitQuiz(this.quizId, submission).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Nộp bài kiểm tra thành công!',
          life: 3000,
        });
        this.router.navigate([
          `/courses/${this.route.snapshot.paramMap.get('courseId') || ''}`,
        ]);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể nộp bài kiểm tra.',
          life: 3000,
        });
      },
    });
  }
}