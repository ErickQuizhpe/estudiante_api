import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, AuthResponse, JwtPayload } from '../models/User';
import { environment } from '../environment';

// CurrentUser es igual a User, sin propiedades adicionales
export type CurrentUser = User;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredAuth();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.storeAuth(response);
          // response.user ya es de tipo User, compatible con CurrentUser
          this.currentUserSubject.next(response.user);
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    // Redirigir al login en lugar del home
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return !this.isTokenExpired(token);
  }

  getCurrentUserId(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.id : null;
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // User tiene roles como string[]
    return user.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('admin');
  }

  isUser(): boolean {
    return (
      this.hasRole('USER') ||
      this.hasRole('user') ||
      this.hasRole('STUDENT') ||
      this.hasRole('student')
    );
  }

  private storeAuth(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
  }

  private loadStoredAuth(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem(this.USER_KEY);

    if (token && userStr && !this.isTokenExpired(token)) {
      try {
        const storedUser = JSON.parse(userStr);
        // Asegurar que el usuario almacenado tenga todas las propiedades de User
        const user: CurrentUser = {
          id: storedUser.id,
          email: storedUser.email,
          firstName: storedUser.firstName,
          lastName: storedUser.lastName,
          username: storedUser.username || storedUser.email,
          active: storedUser.active !== undefined ? storedUser.active : true,
          roles: storedUser.roles || []
        };
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.clearStoredAuth();
      }
    } else {
      this.clearStoredAuth();
    }
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  private decodeToken(token: string): JwtPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  refreshTokenIfNeeded(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;

      // Si el token expira en menos de 5 minutos, considerarlo expirado
      if (timeUntilExpiry < 300) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return false;
    }
  }

  setCurrentUser(user: CurrentUser) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
