import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminpanelService } from 'src/app/admin-panel/adminpanel.service';
import { Question } from 'src/app/admin-panel/question.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/admin-panel/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  endSubs$: Subject<any> = new Subject();
  questions: Question[] = [];
  displayedColumns: string[] = [
    'Number',
    'Questions',
    'Type',
    'Option',
    'Modification',
  ];

  constructor(
    private questionService: AdminpanelService,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._getQuestions();
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }

  private _getQuestions() {
    this.questionService
      .getQuestions()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((ques) => {
        this.questions = ques;
      });
  }

  deleteQuestion(questionId: string) {
    this.questionService
      .deleteQuestion(questionId)
      .pipe(takeUntil(this.endSubs$))
      .subscribe(
        () => {
          this._snackBar.open('Question is Deleted!', '', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this._getQuestions();
        },
        (error) => {
          this._snackBar.open('Question could not be deleted!', '', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      );
  }

  goToUser() {
    this.router.navigate(['/adminpanel/user']);
  }

  logoutAdmin() {
    this.authService.logout();
  }

  goToCreate() {
    this.router.navigate(['/adminpanel/create']);
  }

  updateQuestion(questionId: string) {
    this.router.navigateByUrl(`adminpanel/create/${questionId}`);
    // this.router.navigate(['adminpanel', 'create', questionId]);
  }
}
