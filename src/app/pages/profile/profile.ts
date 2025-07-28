import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { User } from '../../models/User';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DialogModule,
    FileUploadModule,
    ToastModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [MessageService]
})
export class Profile implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading: boolean = false;
  editMode: boolean = false;
  showPasswordDialog: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        username: this.currentUser.username
      });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Cancelar edición - restaurar valores originales
      this.loadUserProfile();
    }
  }

  saveProfile() {
    if (this.profileForm.valid && this.currentUser) {
      this.loading = true;
      const formData = this.profileForm.value;

      this.userService.updateUserProfile(this.currentUser.id, formData).subscribe({
        next: (updatedUser) => {
          // Actualizar el usuario en el AuthService
          this.authService.setCurrentUser(updatedUser);
          this.currentUser = updatedUser;
          this.editMode = false;
          this.loading = false;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Perfil actualizado correctamente'
          });
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.loading = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el perfil'
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  openPasswordDialog() {
    this.passwordForm.reset();
    this.showPasswordDialog = true;
  }

  closePasswordDialog() {
    this.showPasswordDialog = false;
    this.passwordForm.reset();
  }

  changePassword() {
    if (this.passwordForm.valid && this.currentUser) {
      this.loading = true;
      const passwordData = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.userService.changePassword(this.currentUser.id, passwordData).subscribe({
        next: () => {
          this.loading = false;
          this.closePasswordDialog();
          
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contraseña cambiada correctamente'
          });
        },
        error: (error) => {
          console.error('Error changing password:', error);
          this.loading = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cambiar la contraseña'
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  onImageUpload(event: any) {
    const file = event.files[0];
    if (file && this.currentUser) {
      this.userService.uploadProfileImage(this.currentUser.id, file).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Imagen de perfil actualizada'
          });
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al subir la imagen'
          });
        }
      });
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string, formGroup: FormGroup = this.profileForm): string {
    const field = formGroup.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return '';
  }

  getRoleLabels(): string[] {
    return this.currentUser?.roles.map(role => {
      switch (role) {
        case 'ADMIN': return 'Administrador';
        case 'USER': return 'Usuario';
        case 'STUDENT': return 'Estudiante';
        default: return role;
      }
    }) || [];
  }
}