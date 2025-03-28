import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // constructor(){}
  const router = inject(Router);
  const authService = inject(AuthService);
  if (true) {
    localStorage.clear()
    router.navigate(['/login']);
    return false;
  }else{
    // router.navigate(['/dashboard/dashboard']);
    return true;
  }

};
