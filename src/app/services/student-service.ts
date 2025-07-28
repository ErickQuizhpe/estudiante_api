import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStudents(soloActivos?: boolean): Observable<Student[]> {
    if (soloActivos === undefined) {
      // Sin filtro - obtener todos los estudiantes
      return this.http.get<Student[]>(`${this.apiUrl}/estudiantes`);
    }
    return this.http.get<Student[]>(`${this.apiUrl}/estudiantes?soloActivos=${soloActivos}`);
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/estudiantes`);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/estudiantes/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/estudiantes`, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/estudiantes/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/estudiantes/${id}`);
  }

  activateStudent(id: number): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/estudiantes/${id}/activar`, {});
  }

  deactivateStudent(id: number): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/estudiantes/${id}/desactivar`, {});
  }

  getStudentByUserIdAlt(userId: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/estudiantes?userId=${userId}`);
  }
}