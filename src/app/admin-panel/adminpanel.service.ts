import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { User } from './user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminpanelService {
  constructor(private http: HttpClient) {}

  //FOR QUESTION PAGE
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>('http://localhost:5000/questions');
  }

  getQuestion(questionId: string): Observable<Question> {
    return this.http.get<Question>(
      `http://localhost:5000/questions/${questionId}`
    );
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(
      'http://localhost:5000/questions/add',
      question
    );
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.http.put<Question>(
      'http://localhost:5000/questions/add/' + question.id,
      question
    );
  }

  deleteQuestion(questionId: string): Observable<unknown> {
    return this.http.delete<unknown>(
      `http://localhost:5000/questions/delete/${questionId}`
    );
  }

  //FOR USER PAGE
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/users/');
  }

  createUser(creationData: User): Observable<User> {
    return this.http.post<User>(
      'http://localhost:5000/users/add',
      creationData
    );
  }

  removeUser(userId: string): Observable<unknown> {
    return this.http.delete<unknown>(
      `http://localhost:5000/users/delete/${userId}`
    );
  }
}
