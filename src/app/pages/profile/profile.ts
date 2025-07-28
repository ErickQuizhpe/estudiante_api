import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { User } from '../../models/User';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    AvatarModule,
    ToastModule,
    DividerModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  editedUser: User = {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    roles: [],
    active: true
  };
  
  profileImage: string | null = null;
  isEditing: boolean = false;
  loading: boolean = false;
  uploadedFile: File | null = null;

  // Validación
  errors: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.editedUser = { ...this.currentUser };
      this.loadProfileImage();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadProfileImage() {
    // Simular carga de imagen de perfil
    this.profileImage = `https://ui-avatars.com/api/?name=${this.currentUser?.firstName}+${this.currentUser?.lastName}&size=200&background=random`;
  }

  enableEdit() {
    this.isEditing = true;
    this.errors = {};
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedUser = { ...this.currentUser! };
    this.errors = {};
    this.uploadedFile = null;
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.editedUser.firstName.trim()) {
      this.errors.firstName = 'El nombre es requerido';
      isValid = false;
    }

    if (!this.editedUser.lastName.trim()) {
      this.errors.lastName = 'El apellido es requerido';
      isValid = false;
    }

    if (!this.editedUser.email.trim()) {
      this.errors.email = 'El email es requerido';
      isValid = false;
    } else if (!this.isValidEmail(this.editedUser.email)) {
      this.errors.email = 'El email no es válido';
      isValid = false;
    }

    if (!this.editedUser.username.trim()) {
      this.errors.username = 'El nombre de usuario es requerido';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async saveProfile() {
    if (!this.validateForm()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor corrige los errores en el formulario'
      });
      return;
    }

    this.loading = true;

    try {
      // Simular actualización del usuario
      const updatedUser = await this.userService.updateUser(this.editedUser.id, this.editedUser).toPromise();
      
      if (updatedUser) {
        // Actualizar el usuario en el servicio de autenticación
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        
        this.currentUser = updatedUser;
        this.isEditing = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Perfil actualizado correctamente'
        });

        // Si hay una imagen nueva, subirla
        if (this.uploadedFile) {
          await this.uploadProfileImage();
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar el perfil'
      });
    } finally {
      this.loading = false;
    }
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFile = file;
      
      // Previsualizar imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadProfileImage() {
    if (!this.uploadedFile) return;

    try {
      // Simular subida de imagen
      const formData = new FormData();
      formData.append('image', this.uploadedFile);
      
      // Aquí iría la llamada real al servicio
      // await this.userService.uploadProfileImage(this.currentUser!.id, formData).toPromise();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Imagen de perfil actualizada'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al subir la imagen'
      });
    }
  }

  removeImage() {
    this.profileImage = `https://ui-avatars.com/api/?name=${this.currentUser?.firstName}+${this.currentUser?.lastName}&size=200&background=random`;
    this.uploadedFile = null;
  }

  getInitials(): string {
    if (!this.currentUser) return 'U';
    const first = this.currentUser.firstName?.charAt(0) || '';
    const last = this.currentUser.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
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
