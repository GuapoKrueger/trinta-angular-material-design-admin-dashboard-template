import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../authentication/services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';


export const AuthInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.userToken}`,
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Si el servidor devuelve 401 (Unauthorized), intentar refrescar el token
        authService.logout();
        router.navigate(['/authentication']);
        return throwError(() => new Error('Token ha expirado o el usuario no está autorizado.'));
      }
      // console.error('Error en la solicitud:', error);
      return throwError(() => error); // Si el error no es 401, simplemente propagar el error
    })
  );
};
