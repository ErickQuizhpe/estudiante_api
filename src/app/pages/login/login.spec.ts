import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, EMPTY } from 'rxjs';
import { Login } from './login';
import { AuthService } from '../../services/auth-service';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Login - Pruebas Básicas', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'isAdmin']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: EMPTY,
      routerState: { root: {} }
    });
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { data: {} },
      params: of({}),
      queryParams: of({})
    });

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: MessageService, useValue: messageSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Configurar todos los métodos necesarios
    authServiceSpy.isAuthenticated.and.returnValue(false);
    authServiceSpy.isAdmin.and.returnValue(false);
    routerSpy.createUrlTree.and.returnValue({} as any);
    routerSpy.serializeUrl.and.returnValue('/');
    
    fixture.detectChanges();
  });

  // Prueba 1: Login exitoso
  it('debe hacer login correctamente', (done) => {
    authServiceSpy.login.and.returnValue(of({ 
      token: 'test', 
      user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', username: 'test', active: true, roles: ['USER'] } 
    }));
    
    component.loginForm.patchValue({ username: 'test@test.com', password: '123456' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    
    // Esperar a que se ejecute el setTimeout
    setTimeout(() => {
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      done();
    }, 1100);
  });

});
