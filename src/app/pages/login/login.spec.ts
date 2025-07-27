import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Login } from './login';
import { AuthService } from '../../services/auth-service';
import { of, throwError } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'isAuthenticated',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        ToastModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        CardModule,
        DividerModule,
      ],
      providers: [
        MessageService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    component.ngOnInit();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate required fields', () => {
    component.ngOnInit();
    component.onSubmit();

    expect(component.loginForm.get('email')?.errors?.['required']).toBeTruthy();
    expect(
      component.loginForm.get('password')?.errors?.['required']
    ).toBeTruthy();
  });

  it('should validate email format', () => {
    component.ngOnInit();
    component.loginForm.patchValue({ email: 'invalid-email' });
    component.onSubmit();

    expect(component.loginForm.get('email')?.errors?.['email']).toBeTruthy();
  });

  it('should call auth service on valid form submission', () => {
    const mockResponse = {
      user: {
        id: '1',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        roles: ['USER'],
        active: true,
      },
      token: 'mock-jwt-token',
    };

    authService.login.and.returnValue(of(mockResponse));
    authService.isAuthenticated.and.returnValue(false);

    component.ngOnInit();
    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      username: 'test@test.com',
      password: 'password123',
    });
  });
});
