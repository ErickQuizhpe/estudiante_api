import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { UserService } from '../../../services/user-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
  providers: [UserService],
})
export class AdminUsers implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  userDialog = false;
  isEdit = false;
  user: User = {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    roles: ['USER'],
    active: true,
    password: '',
  };
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        // Mapear 'enabled' a 'active' para cada usuario
        this.users = data.map(u => ({ ...u, active: (u as any).enabled ?? u.active }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openNew() {
    this.user = {
      id: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      roles: ['USER'],
      active: true,
      password: '',
    };
    this.isEdit = false;
    this.userDialog = true;
  }

  editUser(user: User) {
    this.user = { ...user };
    this.user.password = ''; // Limpiar password por seguridad
    this.isEdit = true;
    this.userDialog = true;
  }

  saveUser() {
    // Refuerza que los campos no sean null ni undefined
    const safeFirstName = this.user.firstName ?? '';
    const safeLastName = this.user.lastName ?? '';
    const safeUsername = this.user.username ?? '';
    const safeEmail = this.user.email ?? '';
    const safePassword = this.user.password ?? '';
    const safeRoles = Array.isArray(this.user.roles) ? this.user.roles : ['USER'];
    const safeEnabled = this.user.active === undefined ? true : this.user.active;
    if (this.isEdit && this.user.id) {
      const userToUpdate: any = {
        username: safeUsername,
        email: safeEmail,
        password: safePassword,
        firstName: safeFirstName,
        lastName: safeLastName,
        enabled: safeEnabled,
        roles: safeRoles
      };
      this.userService.updateUser(this.user.id, userToUpdate).subscribe(() => {
        this.loadUsers();
        this.userDialog = false;
      });
    } else {
      const userToCreate: any = {
        username: safeUsername,
        email: safeEmail,
        password: safePassword,
        firstName: safeFirstName,
        lastName: safeLastName,
        enabled: safeEnabled,
        roles: safeRoles
      };
      this.userService.createUser(userToCreate).subscribe(() => {
        this.loadUsers();
        this.userDialog = false;
      });
    }
  }

  deleteUser(user: User) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  toggleActive(user: User) {
    const userToUpdate: any = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      enabled: !user.active,
      roles: user.roles,
      password: '' // No cambiamos la contraseña
    };
    this.userService.updateUser(user.id, userToUpdate).subscribe(() => {
      this.loadUsers();
    });
  }

  hideDialog() {
    this.userDialog = false;
  }

  getRoleLabel(roles: string[]): string {
    if (roles.includes('ADMIN')) {
      return 'Administrador';
    }
    return 'Usuario';
  }
}
