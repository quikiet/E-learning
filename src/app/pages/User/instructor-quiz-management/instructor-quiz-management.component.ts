import { Component, OnInit } from '@angular/core';

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
import { Tooltip, TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-instructor-quiz-management',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TableModule,
    FormsModule,
    TagModule,
    DialogModule,
    CheckboxModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    TooltipModule
],
  providers: [MessageService, QuizService],
  templateUrl: './instructor-quiz-management.component.html',
  styleUrls: ['./instructor-quiz-management.component.css'],
})
export class InstructorQuizManagementComponent implements OnInit {
  showAddQuizModal = false;
  showAddQuestionModal = false;
  lessonID: number | null = null;
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
    is_visible: true,
    choices: [
      { content: '', is_correct: false },
      { content: '', is_correct: false }
    ]
  };
  isLoading = true;

  questionTypes = [
    { label: 'Multiple choice', value: 'multiple_choice' },
    { label: 'True/False', value: 'true_false' }
  ];
  isEditting = false;
  quizzes: any[] = [];
  course: any = { id: null, course_name: '' };

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('lessonID');
      this.lessonID = id ? +id : null;
      if (this.lessonID) {
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
    if (this.lessonID) {
      this.quizService.getQuizzesOfLesson(this.lessonID).subscribe({
        next: (response) => {
          this.quizzes = response.data;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Failed to fetch Quizzes',
            life: 3000,
          });
        }
      });
    }
  }

  cloneQuiz(quiz: any) {
    this.isLoading = true;
    this.quizService.cloneQuiz(quiz.quiz_id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000,
        });
        this.loadQuizzes();
        this.isLoading = false;
      }, error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000,
        });
      }
    })
  }

  openAddQuizModal() {
    this.showAddQuizModal = true;
  }

  openAddQuestionModal(quiz: any) {
    this.selectedQuizId = quiz.quiz_id;
    this.newQuestion.quiz_id = quiz.quiz_id;
    console.log(this.newQuestion.quiz_id);

    this.showAddQuestionModal = true;
  }

  resetQuestionForm() {
    this.newQuestion = {
      quiz_id: this.selectedQuizId,
      title: '',
      question_type: 'multiple_choice',
      is_visible: true,
      choices: [
        { content: '', is_correct: false },
        { content: '', is_correct: false }
      ]
    };
  }

  addChoice() {
    this.newQuestion.choices.push({
      content: '',
      is_correct: false,
    });
  }

  removeChoice(index: number) {
    if (this.newQuestion.choices.length > 2) {
      this.newQuestion.choices.splice(index, 1);
      // this.newQuestion.choices.forEach((choice, i) => choice.sort_order = i);
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
    console.log(1);

    if (!this.newQuestion.title ||
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
        // points: this.newQuestion.points,
        // sort_order: this.newQuestion.sort_order,
        is_visible: this.newQuestion.is_visible
      };
      console.log(questionData);

      this.quizService.createQuestion(questionData).subscribe({
        next: (questionResponse) => {
          const questionId = questionResponse.id;
          // Tạo từng QuestionChoice
          const choiceObservables = this.newQuestion.choices.map(choice =>
            this.quizService.createQuestionChoice({
              question_id: questionId,
              content: choice.content,
              is_correct: choice.is_correct,
              // sort_order: choice.sort_order
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
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: err.message,
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
      lesson_id: this.lessonID,
      title: this.newQuiz.title,
      max_attempts: this.newQuiz.max_attempts,
      time_limit: this.newQuiz.time_limit,
      is_visible: this.newQuiz.is_visible,
    };
    console.log(newQuiz);

    this.quizService.createQuiz(newQuiz).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Create successful',
          life: 3000,
        });
        this.showAddQuizModal = false;
        this.loadQuizzes();
        this.resetQuizForm();
      }, error: (err) => {
        console.log(err.message);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000,
        });
      }
    });

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
    this.isEditting = true;
    this.showAddQuizModal = true
    this.newQuiz = {
      title: quiz.title,
      max_attempts: quiz.max_attempts,
      time_limit: quiz.time_limit,
      is_visible: quiz.is_visible === 1 ? true : false,
    };
    this.selectedQuizId = quiz.quiz_id;
    // this.messageService.add({
    //   severity: 'info',
    //   summary: 'Thông báo',
    //   detail: `Chức năng sửa Quiz ${quiz.title} chưa được triển khai.`,
    //   life: 3000,
    // });
  }

  updateQuiz() {
    if (this.selectedQuizId) {
      this.quizService.updateQuiz(this.newQuiz, this.selectedQuizId).subscribe({
        next: (res) => {
          this.isEditting = false;
          this.showAddQuizModal = false;
          this.resetQuizForm();
          this.loadQuizzes();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message || `Update successful`,
            life: 3000,
          });
        }, error: (err) => {
          console.log(err.message);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || `Update error`,
            life: 3000,
          });
        }
      })
    }
  }

  deleteQuiz(quiz_id: number) {
    const input = window.prompt('Please enter "OK" to confirm deleting this test: ' + quiz_id);
    if (input === null) {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancel',
        detail: 'Cancel deleting this test',
        life: 3000,
      });
      return;
    }
    if (input.trim().toUpperCase() === 'OK') {
      this.quizService.deleteQuiz(quiz_id).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message || 'Success deleting this test',
            life: 3000,
          });
          this.loadQuizzes();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: err.message,
            life: 3000,
          });
          this.loadQuizzes();
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please enter correct "OK" to delete',
        life: 3000,
      });
    }
  }

  viewQuizDetail(quiz: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: `Điều hướng đến trang chi tiết Quiz ${quiz.title} (ID: ${quiz.id}).`,
      life: 3000,
    });
    this.router.navigate([`quiz/${quiz.quiz_id}/attempt`]);
  }
}