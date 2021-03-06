import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { LoginService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanLoad {
  constructor(private loginService: LoginService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.loginService.isAuthenticated.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/admin', { replaceUrl: true });
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
