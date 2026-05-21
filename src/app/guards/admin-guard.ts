import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  // ❌ not logged in
  if (!auth.isLoggedIn()) {

    router.navigate(['/home'], {
      replaceUrl: true
    });

    return false;
  }

  // ❌ not admin
  if (!auth.isAdmin()) {

    alert("Access denied: Admin only");

    router.navigate(['/dashboard/orders'], {
      replaceUrl: true
    });

    return false;
  }
 
  // ✅ allow access
  return true;
};