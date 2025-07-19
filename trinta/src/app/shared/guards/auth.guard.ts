import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../authentication/services/auth.service';
import { map, switchMap, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    switchMap(isAuth => {
      if (!isAuth) {
        router.navigate(['/authentication']);
        return of(false);
      }

      return authService.getUserRole().pipe(
        map(userRole => {
          if (state.url === '/') {
            if (userRole === 'Vigilante') {
              router.navigate(['/guard-invitations']); // Redirect Vigilante to GuardInvitationsComponent
              return false;
            } else if (['Super Admin', 'Administrador', 'Vecino'].includes(userRole)) {
              router.navigate(['/home']); // Redirect other roles to HomeMenuComponent
              return false;
            }
          }

          // Función para obtener roles de la ruta actual o rutas anidadas
          const getRolesFromRoute = (routeSnapshot: ActivatedRouteSnapshot): Array<string> | null => {
            // Primero revisa la ruta actual
            if (routeSnapshot.data['roles']) {
              return routeSnapshot.data['roles'] as Array<string>;
            }
            
            // Si no hay roles en la ruta actual, busca en las rutas hijas
            if (routeSnapshot.children && routeSnapshot.children.length > 0) {
              for (const child of routeSnapshot.children) {
                const childRoles = getRolesFromRoute(child);
                if (childRoles) {
                  return childRoles;
                }
              }
            }
            
            // También revisa la ruta padre si existe
            if (routeSnapshot.parent && routeSnapshot.parent.data['roles']) {
              return routeSnapshot.parent.data['roles'] as Array<string>;
            }
            
            return null;
          };

          const roles = getRolesFromRoute(route);
          if (roles && !roles.includes(userRole)) {
            router.navigate(['/access-denied']); // Redirect to access denied page
            return false;
          }

          return true;
        })
      );
    })
  );
};
