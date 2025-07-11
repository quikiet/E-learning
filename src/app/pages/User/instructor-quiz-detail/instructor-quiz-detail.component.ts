import { Component } from '@angular/core';

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
import { SelectModule } from 'primeng/select';

interface QuestionType {
  label: string;
  value: string;
}

@Component({
  selector: 'app-instructor-quiz-detail',
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
    SelectModule
],
  providers: [MessageService],
  templateUrl: './instructor-quiz-detail.component.html',
  styleUrls: ['./instructor-quiz-detail.component.css'],
})
export class InstructorQuizDetailComponent {
  showAddQuestionModal = false;
  showAddChoiceModal = false;

  // Dữ liệu giả cho Quiz
  quiz = {
    id: 175,
    title: 'Test thêm quiz instructor',
    max_attempts: 3,
    time_limit: 30,
    is_visible: true,
    lesson_id: 211,
    lesson_title: 'Lesson 1: Topic for The Music of American English Pronunciation',
  };

  // Dữ liệu giả cho danh sách câu hỏi
  questions = [
    {
      id: 84689,
      title: 'What is the capital of France?',
      question_type: 'multiple_choice',
      points: 1,
      is_visible: true,
    },
    {
      id: 84690,
      title: 'What is the largest planet in our solar system?',
      question_type: 'multiple_choice',
      points: 2,
      is_visible: false,
    },
    {
      id: 84691,
      title: 'Which country has the longest coastline?',
      question_type: 'multiple_choice',
      points: 1,
      is_visible: true,
    },
  ];

  // Dữ liệu giả cho danh sách lựa chọn (cho câu hỏi ID 84689)
  choices = [
    {
      id: 1001,
      content: 'Paris',
      is_correct: true,
      question_id: 84689,
    },
    {
      id: 1002,
      content: 'London',
      is_correct: false,
      question_id: 84689,
    },
    {
      id: 1003,
      content: 'Berlin',
      is_correct: false,
      question_id: 84689,
    },
    {
      id: 1004,
      content: 'Madrid',
      is_correct: false,
      question_id: 84689,
    },
  ];

  // Form thêm câu hỏi
  newQuestion = {
    quiz_id: 175,
    title: '',
    question_type: 'multiple_choice',
    points: 1,
    is_visible: true,
    sort_order: 0,
  };

  // Form thêm lựa chọn
  newChoice = {
    question_id: 84689,
    content: '',
    is_correct: false,
    sort_order: 0,
  };

  questionTypes: QuestionType[] = [
    { label: 'Trắc nghiệm', value: 'multiple_choice' },
  ];

  constructor(private messageService: MessageService) { }

  openAddQuestionModal() {
    this.showAddQuestionModal = true;
  }

  resetQuestionForm() {
    this.newQuestion = {
      quiz_id: this.quiz.id,
      title: '',
      question_type: 'multiple_choice',
      points: 1,
      is_visible: true,
      sort_order: 0,
    };
  }

  createQuestion() {
    if (!this.newQuestion.title || !this.newQuestion.question_type || this.newQuestion.points <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin hợp lệ.',
        life: 3000,
      });
      return;
    }

    // Giả lập thêm câu hỏi
    const newQuestion = {
      id: this.questions.length + 84689 + 1,
      title: this.newQuestion.title,
      question_type: this.newQuestion.question_type,
      points: this.newQuestion.points,
      is_visible: this.newQuestion.is_visible,
    };
    this.questions.push(newQuestion);
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Câu hỏi đã được tạo thành công!',
      life: 3000,
    });
    this.showAddQuestionModal = false;
    this.showAddChoiceModal = true; // Mở modal thêm lựa chọn
    this.newChoice.question_id = newQuestion.id; // Cập nhật question_id
    this.resetQuestionForm();
  }

  editQuestion(question: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: `Chức năng sửa câu hỏi ${question.title} chưa được triển khai.`,
      life: 3000,
    });
  }

  deleteQuestion(question: any) {
    this.questions = this.questions.filter((q) => q.id !== question.id);
    this.choices = this.choices.filter((c) => c.question_id !== question.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: `Câu hỏi ${question.title} đã được xóa.`,
      life: 3000,
    });
  }

  openAddChoiceModal(question: any) {
    this.newChoice.question_id = question.id;
    this.showAddChoiceModal = true;
  }

  resetChoiceForm() {
    this.newChoice = {
      question_id: this.newChoice.question_id,
      content: '',
      is_correct: false,
      sort_order: 0,
    };
  }

  createChoice(continueAdding: boolean = false) {
    if (!this.newChoice.content) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng nhập nội dung lựa chọn.',
        life: 3000,
      });
      return;
    }

    // Giả lập thêm lựa chọn
    const newChoice = {
      id: this.choices.length + 1001 + 1,
      content: this.newChoice.content,
      is_correct: this.newChoice.is_correct,
      question_id: this.newChoice.question_id,
    };
    this.choices.push(newChoice);
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Lựa chọn đã được tạo thành công!',
      life: 3000,
    });

    if (!continueAdding) {
      this.showAddChoiceModal = false;
      this.showAddQuestionModal = true; // Quay lại modal câu hỏi
    }
    this.resetChoiceForm();
  }

  editChoice(choice: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: `Chức năng sửa lựa chọn ${choice.content} chưa được triển khai.`,
      life: 3000,
    });
  }

  deleteChoice(choice: any) {
    this.choices = this.choices.filter((c) => c.id !== choice.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: `Lựa chọn ${choice.content} đã được xóa.`,
      life: 3000,
    });
  }
}