import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/admin-panel/question.model';
import { AdminpanelService } from 'src/app/admin-panel/adminpanel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
interface QuesTypes {
  display: string;
  value: string;
}
interface TagTypes {
  display: string;
  value: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  isSubmitteed = false;
  editMode = false;
  currentQuestionId!: string;

  types: QuesTypes[] = [
    { display: 'Text', value: 'text' },
    { display: 'MCQ', value: 'multiple_choice' },
    { display: 'Date', value: 'datepicker' },
  ];

  tags: TagTypes[] = [
    { display: 'Text', value: 'name' },
    { display: 'Name', value: 'name' },
    { display: 'E-mail', value: 'email' },
    { display: 'Address', value: 'address' },
    { display: 'Zipcode', value: 'zipcode' },
    { display: 'SSN', value: 'ssn' },
    { display: 'Date', value: 'dob' },
    { display: 'Phone Number', value: 'Phone' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private questionSevice: AdminpanelService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      questionNumber: ['', Validators.required],
      question: ['', Validators.required],
      type: ['', Validators.required],
      tag: [''],
      options: [''],
    });
    this._checkEditMode();
  }

  get questionForm() {
    return this.form.controls;
  }

  onSubmit() {
    this.isSubmitteed = true;
    if (this.form.invalid) {
      return;
    }
    const question: Question = {
      id: this.currentQuestionId,
      questionNumber: this.questionForm.questionNumber.value,
      question: this.questionForm.question.value,
      type: this.questionForm.type.value,
      tag: this.questionForm.tag.value,
      options: this.questionForm.options.value,
    };

    if (this.editMode) {
      this._updateQuestion(question);
    } else {
      this._addQuestion(question);
    }
  }

  goToQuestion() {
    this.router.navigateByUrl(`/adminpanel/question`);
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.currentQuestionId = params.id;
        this.editMode = true;
        this.questionSevice.getQuestion(params.id).subscribe((question) => {
          this.questionForm.questionNumber.setValue(question.questionNumber);
          this.questionForm.question.setValue(question.question);
          this.questionForm.type.setValue(question.type);
          this.questionForm.tag.setValue(question.tag);
          this.questionForm.options.setValue(question.options);
        });
      }
    });
  }

  private _updateQuestion(question: Question) {
    this.questionSevice.updateQuestion(question).subscribe(
      () => {
        this._snackBar.open('Question is Updated!', '', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goToQuestion();
      },
      (error) => {
        this._snackBar.open('Question could not be updated!', '', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    );
  }
  private _addQuestion(question: Question) {
    this.questionSevice.createQuestion(question).subscribe(
      () => {
        this._snackBar.open('Question is Added!', '', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goToQuestion();
      },
      (error) => {
        this._snackBar.open('Question could not be added!', '', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    );
  }
}
