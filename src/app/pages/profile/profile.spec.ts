import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Profile } from './profile';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { MessageService } from 'primeng/api';


describe('Profile - Pruebas Básicas', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser = { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', username: 'test', active: true, roles: ['USER'] };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'setCurrentUser']);
    const userSpy = jasmine.createSpyObj('UserService', ['updateUserProfile']);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [Profile, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UserService, useValue: userSpy },
        { provide: MessageService, useValue: messageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    
    const authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
  });

  // Prueba 1: Actualizar perfil exitoso
  it('debe actualizar perfil correctamente', () => {
    userServiceSpy.updateUserProfile.and.returnValue(of(mockUser));
    
    component.editMode = true;
    component.profileForm.patchValue({ firstName: 'Updated', lastName: 'Name', email: 'test@test.com', username: 'test' });
    component.saveProfile();

    expect(userServiceSpy.updateUserProfile).toHaveBeenCalled();
    expect(component.editMode).toBeFalsy();
  });


});