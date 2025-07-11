import { Component } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/User';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  imports: [],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(
        tap((users) => {
          this.users = users;
          console.log('users: ', this.users);
        }),
        catchError((error) => {
          console.error('Error al obtener los usuarios: ', error);
          return of([]);
        })
      )
      .subscribe();
  }
}
