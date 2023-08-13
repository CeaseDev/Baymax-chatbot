import { Injectable } from '@angular/core';
import { CanActivate, NavigationStart, Router } from '@angular/router';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageToken: LocalstorageService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.canActivate();
      }
    });
  }

  canActivate() {
    const token = this.localStorageToken.getToken();
    if (!token) {
      location.assign(`http://localhost:4200/adminpanel/login`);
      return false;
    } else {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if (tokenDecode.isAdmin && !this._tokenExpired(tokenDecode.exp)) {
        return true;
      } else {
        location.assign(`http://localhost:4200/adminpanel/login`);
        return false;
      }
    }
  }

  private _tokenExpired(expiration: any): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
