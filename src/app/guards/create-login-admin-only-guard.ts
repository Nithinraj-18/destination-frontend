import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const createLoginAdminOnlyGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  // ❌ NOT LOGGED IN
  if (!auth.isLoggedIn()) {

    router.navigate(['/home'], {
      replaceUrl: true
    });

    return false;
  }

  // ❌ ONLY ADMIN ALLOWED
  if (!auth.isCreateLoginAllowed()) {

    router.navigate(['/dashboard/orders'], {
      replaceUrl: true
    });

    return false;
  }

  // ✅ ADMIN ALLOWED
  return true;
};