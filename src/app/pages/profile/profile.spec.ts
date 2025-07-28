import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './profile';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { User } from '../../models/User';

// Mock modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    roles: ['USER'],
    active: true
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['updateUser']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        FormsModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        FileUploadModule,
        AvatarModule,
        ToastModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('Inicialización del componente', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('debe cargar el perfil del usuario al inicializar', () => {
      authService.getCurrentUser.and.returnValue(mockUser);
      
      component.ngOnInit();
      
      expect(component.currentUser).toEqual(mockUser);
      expect(component.editedUser).toEqual(mockUser);
    });

    it('debe redirigir al login si no hay usuario autenticado', () => {
      authService.getCurrentUser.and.returnValue(null);
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Funcionalidad de edición', () => {
    beforeEach(() => {
      authService.getCurrentUser.and.returnValue(mockUser);
      component.ngOnInit();
    });

    it('debe habilitar el modo de edición', () => {
      component.enableEdit();
      
      expect(component.isEditing).toBe(true);
      expect(component.errors).toEqual({});
    });

    it('debe cancelar la edición y restaurar datos originales', () => {
      component.enableEdit();
      component.editedUser.firstName = 'Modified';
      component.errors = { firstName: 'Error test' };
      
      component.cancelEdit();
      
      expect(component.isEditing).toBe(false);
      expect(component.editedUser.firstName).toBe(mockUser.firstName);
      expect(component.errors).toEqual({});
    });
  });

  describe('Validación del formulario', () => {
    beforeEach(() => {
      component.editedUser = { ...mockUser };
    });

    it('debe validar correctamente un formulario válido', () => {
      const result = component.validateForm();
      
      expect(result).toBe(true);
      expect(component.errors).toEqual({});
    });

    it('debe detectar errores cuando faltan campos requeridos', () => {
      component.editedUser.firstName = '';
      component.editedUser.lastName = '';
      component.editedUser.email = '';
      component.editedUser.username = '';
      
      const result = component.validateForm();
      
      expect(result).toBe(false);
      expect(component.errors.firstName).toBe('El nombre es requerido');
      expect(component.errors.lastName).toBe('El apellido es requerido');
      expect(component.errors.email).toBe('El email es requerido');
      expect(component.errors.username).toBe('El nombre de usuario es requerido');
    });

    it('debe validar formato de email', () => {
      component.editedUser.email = 'invalid-email';
      
      const result = component.validateForm();
      
      expect(result).toBe(false);
      expect(component.errors.email).toBe('El email no es válido');
    });
  });

  describe('Validación de email', () => {
    it('debe aceptar emails válidos', () => {
      expect(component.isValidEmail('test@example.com')).toBe(true);
      expect(component.isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('debe rechazar emails inválidos', () => {
      expect(component.isValidEmail('invalid-email')).toBe(false);
      expect(component.isValidEmail('test@')).toBe(false);
      expect(component.isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('Guardar perfil', () => {
    beforeEach(() => {
      authService.getCurrentUser.and.returnValue(mockUser);
      component.ngOnInit();
      component.enableEdit();
    });

    it('debe guardar el perfil exitosamente', async () => {
      userService.updateUser.and.returnValue(of(mockUser));
      spyOn(localStorage, 'setItem');
      
      await component.saveProfile();
      
      expect(userService.updateUser).toHaveBeenCalledWith(mockUser.id, component.editedUser);
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_user', JSON.stringify(mockUser));
      expect(component.isEditing).toBe(false);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Perfil actualizado correctamente'
      });
    });

    it('debe manejar errores al guardar', async () => {
      userService.updateUser.and.returnValue(throwError('Error'));
      
      await component.saveProfile();
      
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar el perfil'
      });
      expect(component.loading).toBe(false);
    });

    it('no debe guardar si el formulario es inválido', async () => {
      component.editedUser.firstName = '';
      
      await component.saveProfile();
      
      expect(userService.updateUser).not.toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor corrige los errores en el formulario'
      });
    });
  });

  describe('Manejo de imágenes', () => {
    beforeEach(() => {
      authService.getCurrentUser.and.returnValue(mockUser);
      component.ngOnInit();
    });

    it('debe procesar la selección de archivo', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockEvent = { files: [mockFile] };
      
      spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function(this: FileReader) {
        this.onload!({ target: { result: 'data:image/jpeg;base64,test' } } as any);
      });
      
      component.onFileSelect(mockEvent);
      
      expect(component.uploadedFile).toBe(mockFile);
    });

    it('debe remover la imagen y restaurar avatar por defecto', () => {
      component.removeImage();
      
      expect(component.profileImage).toContain('ui-avatars.com');
      expect(component.uploadedFile).toBe(null);
    });

    it('debe subir imagen exitosamente', async () => {
      const mockFile = new File([''], 'test.jpg');
      component.uploadedFile = mockFile;
      
      await component.uploadProfileImage();
      
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Imagen de perfil actualizada'
      });
    });
  });

  describe('Funciones de utilidad', () => {
    beforeEach(() => {
      authService.getCurrentUser.and.returnValue(mockUser);
      component.ngOnInit();
    });

    it('debe generar iniciales correctamente', () => {
      const initials = component.getInitials();
      expect(initials).toBe('TU');
    });

    it('debe retornar "U" si no hay usuario', () => {
      component.currentUser = null;
      const initials = component.getInitials();
      expect(initials).toBe('U');
    });

    it('debe traducir roles correctamente', () => {
      component.currentUser = {
        ...mockUser,
        roles: ['ADMIN', 'USER', 'STUDENT']
      };
      
      const labels = component.getRoleLabels();
      
      expect(labels).toEqual(['Administrador', 'Usuario', 'Estudiante']);
    });

    it('debe manejar roles desconocidos', () => {
      component.currentUser = {
        ...mockUser,
        roles: ['UNKNOWN_ROLE']
      };
      
      const labels = component.getRoleLabels();
      
      expect(labels).toEqual(['UNKNOWN_ROLE']);
    });
  });

  describe('Interfaz de usuario', () => {
    beforeEach(() => {
      authService.getCurrentUser.and.returnValue(mockUser);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('debe mostrar información del usuario', () => {
      const compiled = fixture.nativeElement;
      
      expect(compiled.textContent).toContain('Test User');
      expect(compiled.textContent).toContain('testuser');
      expect(compiled.textContent).toContain('test@example.com');
    });

    it('debe mostrar botón de editar cuando no está en modo edición', () => {
      const editButton = fixture.nativeElement.querySelector('p-button[label="Editar Perfil"]');
      expect(editButton).toBeTruthy();
    });

    it('debe mostrar formulario cuando está en modo edición', () => {
      component.enableEdit();
      fixture.detectChanges();
      
      const form = fixture.nativeElement.querySelector('.profile-form');
      expect(form).toBeTruthy();
    });

    it('debe mostrar errores de validación', () => {
      component.enableEdit();
      component.errors.firstName = 'Error de prueba';
      fixture.detectChanges();
      
      const errorMessage = fixture.nativeElement.querySelector('.error-message');
      expect(errorMessage?.textContent.trim()).toBe('Error de prueba');
    });
  });

  describe('Estados de carga', () => {
    beforeEach(() => {
      authService.getCurrentUser.and.returnValue(mockUser);
      component.ngOnInit();
    });

    it('debe mostrar estado de carga durante el guardado', async () => {
      userService.updateUser.and.returnValue(of(mockUser));
      component.enableEdit();
      
      const savePromise = component.saveProfile();
      expect(component.loading).toBe(true);
      
      await savePromise;
      expect(component.loading).toBe(false);
    });
  });
});