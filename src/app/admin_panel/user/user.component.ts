import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminpanelService } from 'src/app/admin-panel/adminpanel.service';
import { User } from 'src/app/admin-panel/user.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/admin-panel/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  endSubs$: Subject<any> = new Subject();
  users: User[] = [];
  displayedColumns: string[] = [
    'FirstName',
    'LastName',
    'Email',
    'Mobile',
    'CommMedium',
    'Address',
    'City',
    'State',
    'Zipcode',
    'DOB',
    'Gender',
    'SSN',
    'Modification',
  ];

  constructor(
    private userService: AdminpanelService,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._getUsers();
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }

  private _getUsers() {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((user) => {
        this.users = user;
      });
  }

  removeUser(userId: string) {
    this.userService
      .removeUser(userId)
      .pipe(takeUntil(this.endSubs$))
      .subscribe(
        () => {
          this._snackBar.open('User Removed Successfully!', '', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this._getUsers();
        },
        (error) => {
          this._snackBar.open('User could not be Removed!', '', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      );
  }

  goToQuestion() {
    this.router.navigate(['/adminpanel/question']);
  }

  logoutAdmin() {
    this.authService.logout();
  }
}
