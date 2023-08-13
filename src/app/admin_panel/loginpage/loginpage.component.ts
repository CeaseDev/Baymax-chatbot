import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/admin-panel/auth.service';
import { LocalstorageService } from 'src/app/admin-panel/localstorage.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css'],
})
export class LoginpageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  authError = false;
  isSubmitted = false;
  authMessage = 'Email or Password is wrong!';
  endSubs$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private localStorageService: LocalstorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initLoginForm();
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }

  private _initLoginForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  get loginForm() {
    return this.form.controls;
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    //To pass the login details into auth.service.ts
    this.auth
      .login(this.loginForm.email.value, this.loginForm.password.value)
      .pipe(takeUntil(this.endSubs$))
      .subscribe(
        (admin) => {
          this.authError = false;
          if (admin.token) {
            this.localStorageService.setToken(admin.token);
            this.router.navigate(['/adminpanel/question']);
          }
        },
        (error) => {
          this.authError = true;
          if (error.status !== 400) {
            this.authMessage = 'Error in the server, please try again!';
          }
        }
      );
  }
}
