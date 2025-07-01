import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getAllQuizzes(courseId: number, page: number = 1, perPage: number = 15): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/courses/${courseId}/quizzes?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  getQuizzesOfLesson(lessonId: number, page: number = 1, perPage: number = 15): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quizzes/lesson/${lessonId}?page=${page}&perPage=${perPage}`, { withCredentials: true });
  }

  getQuestions(quizId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/quizzes/${quizId}/questions`, { withCredentials: true });
  }

  studentGetQuestions(quizId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quizzes/${quizId}/questions`, { withCredentials: true });
  }

  studentStartQuiz(quizId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/quizzes/${quizId}/start`, {}, { withCredentials: true });
  }

  cloneQuiz(quizId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/instructor/quizzes/${quizId}/clone`, {}, { withCredentials: true });
  }

  createQuiz(quiz: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/quizzes`, quiz, { withCredentials: true });
  }

  updateQuiz(quiz: any, quiz_id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/instructor/quizzes/${quiz_id}`, quiz, { withCredentials: true });
  }

  deleteQuiz(quizId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/instructor/quizzes/${quizId}`, { withCredentials: true });
  }

  createQuestion(question: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/questions`, question, { withCredentials: true });
  }


  updateQuestion(question_id: number, question: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/questions/${question_id}`, question, { withCredentials: true });
  }

  createQuestionChoice(choice: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/question-choices`, choice, { withCredentials: true });
  }

  deleteQuestionChoice(questionChoice_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/question-choices/${questionChoice_id}`, { withCredentials: true });
  }

  updateQuestionChoice(questionChoice_id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/question-choices/${questionChoice_id}`, data, { withCredentials: true });
  }

  submitQuiz(quizId: number, answers: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/quizzes/${quizId}/submit`, answers, { withCredentials: true });
  }
}
