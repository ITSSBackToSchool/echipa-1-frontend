import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.idTokenClaims$.pipe(
    map(claims => {
      const permissions = claims?.['permissions'] || [];
      const hasAdminPermission = permissions.includes('MANAGE_ROOMS') ||
                                 permissions.includes('DELETE_SEAT') ||
                                 permissions.includes('UPDATE_SEAT');

      if (!hasAdminPermission) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    })
  );
};