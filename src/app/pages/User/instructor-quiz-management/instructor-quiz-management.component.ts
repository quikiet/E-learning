import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../services/lesson/quiz.service';

@Component({
  selector: 'app-instructor-quiz-management',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TableModule,
    FormsModule,
    CommonModule,
    TagModule,
    DialogModule,
    CheckboxModule,
    ToastModule,
    InputTextModule,
    DropdownModule
  ],
  providers: [MessageService, QuizService],
  templateUrl: './instructor-quiz-management.component.html',
  styleUrls: ['./instructor-quiz-management.component.css'],
})
export class InstructorQuizManagementComponent implements OnInit {
  showAddQuizModal = false;
  showAddQuestionModal = false;
  courseId: number | null = null;
  selectedQuizId: number | null = null;
  newQuiz = {
    title: '',
    max_attempts: 3,
    time_limit: 30,
    is_visible: true,
  };
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
    { label: 'Trắc nghiệm', value: 'multiple_choice' },
    { label: 'Đúng/Sai', value: 'true_false' }
  ];

  quizzes: any[] = [];
  course: any = { id: null, course_name: '' };

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('courseId');
      this.courseId = id ? +id : null;
      if (this.courseId) {
        this.loadQuizzes();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không tìm thấy khóa học.',
          life: 3000,
        });
        this.router.navigate(['/profile/manage-courses']);
      }
    });
  }

  loadQuizzes() {
    if (this.courseId) {
      this.quizService.getQuizzes(this.courseId).subscribe({
        next: (response) => {
          if (response.message === 'Quizzes retrieved successfully.') {
            this.course = {
              id: response.data.course_id,
              course_name: response.data.course_name,
            };
            this.quizzes = response.data.quizzes.data.map((quiz: any) => ({
              id: quiz.id,
              title: quiz.title,
              max_attempts: quiz.max_attempts,
              time_limit: quiz.time_limit || 'Không giới hạn',
              is_visible: quiz.is_visible,
              lesson_title: quiz.lesson.title,
              created_at: quiz.created_at,
              updated_at: quiz.updated_at,
            }));
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải danh sách quiz.',
            life: 3000,
          });
        }
      });
    }
  }

  openAddQuizModal() {
    this.showAddQuizModal = true;
  }

  openAddQuestionModal(quiz: any) {
    this.selectedQuizId = quiz.id;
    this.newQuestion.quiz_id = quiz.id;
    this.showAddQuestionModal = true;
  }

  resetQuestionForm() {
    this.newQuestion = {
      quiz_id: this.selectedQuizId,
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

  createQuiz() {
    if (!this.newQuiz.title || this.newQuiz.max_attempts <= 0 || this.newQuiz.time_limit <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin hợp lệ.',
        life: 3000,
      });
      return;
    }

    const newQuiz = {
      id: this.quizzes.length + 175 + 1,
      title: this.newQuiz.title,
      max_attempts: this.newQuiz.max_attempts,
      time_limit: this.newQuiz.time_limit,
      is_visible: this.newQuiz.is_visible,
      lesson_title: 'Unknown Lesson',
    };
    this.quizzes.push(newQuiz);
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Quiz đã được tạo thành công!',
      life: 3000,
    });
    this.showAddQuizModal = false;
    this.resetQuizForm();
  }

  resetQuizForm() {
    this.newQuiz = {
      title: '',
      max_attempts: 3,
      time_limit: 30,
      is_visible: true,
    };
  }

  editQuiz(quiz: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: `Chức năng sửa Quiz ${quiz.title} chưa được triển khai.`,
      life: 3000,
    });
  }

  deleteQuiz(quiz: any) {
    this.quizzes = this.quizzes.filter((q) => q.id !== quiz.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: `Quiz ${quiz.title} đã được xóa.`,
      life: 3000,
    });
  }

  viewQuizDetail(quiz: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: `Điều hướng đến trang chi tiết Quiz ${quiz.title} (ID: ${quiz.id}).`,
      life: 3000,
    });
    this.router.navigate([`quiz/${quiz.id}/attempt`]);
  }
}