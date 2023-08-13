import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from './admin.model';
import { LocalstorageService } from './localstorage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: LocalstorageService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<Admin> {
    return this.http.post<Admin>(`http://localhost:5000/admin/login`, {
      email: email,
      password: password,
    });
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/adminpanel/login']);
  }
}
