import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService = inject(AuthService);

  // Obtener el token del servicio de autenticación
  const token = authService.getToken();

  // Si hay un token y la URL no es para login, agregar el header de autorización
  if (token && !request.url.includes('/auth/login')) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 (Unauthorized), cerrar sesión
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
}
