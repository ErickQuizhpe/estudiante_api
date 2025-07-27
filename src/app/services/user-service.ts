import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  rateAssignment(assignmentId: string, rating: number): Observable<string> {
    // Convertir assignmentId a número si es necesario
    const id = parseInt(assignmentId);
    
    // Asegurar que rating sea un entero (backend espera Integer score)
    const score = Math.round(rating);
    
    // Headers necesarios según el curl de ejemplo
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*'
    });
    
    // El body debe ser un string JSON con el número, como en el curl: -d '2'
    const body = score.toString();
    
    console.log('Enviando calificación al backend:', {
      url: `${this.apiUrl}/api/assignments/${id}/grade`,
      body: body,
      originalAssignmentId: assignmentId,
      parsedId: id,
      originalRating: rating,
      roundedScore: score,
      bodyType: typeof body,
      headers: headers.keys()
    });
    
    // Especificar responseType: 'text' porque el backend devuelve texto plano
    return this.http.put(`${this.apiUrl}/api/assignments/${id}/grade`, { score }, { 
      headers,
      responseType: 'text'
    });
  }

  addFavoriteAssignment(userId: string, assignmentId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/favorite-assignments`, { assignmentId });
  }

  getFavoriteAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/favorite-assignments`);
  }
}
