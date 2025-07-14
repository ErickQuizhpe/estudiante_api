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
        this.users = data;
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
    if (this.isEdit && this.user.id) {
      // Para edición, si el password está vacío, no lo enviamos
      const userToUpdate = { ...this.user };
      if (!userToUpdate.password) {
        delete userToUpdate.password;
      }
      this.userService.updateUser(this.user.id, userToUpdate).subscribe(() => {
        this.loadUsers();
        this.userDialog = false;
      });
    } else {
      this.userService.createUser(this.user).subscribe(() => {
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
