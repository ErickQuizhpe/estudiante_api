import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Materia } from '../models/Materia';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET endpoints
  getAllMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias`);
  }

  getMaterias(): Observable<Materia[]> {
    return this.getAllMaterias();
  }

  getMateria(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/materias/${id}`);
  }

  getMateriasBySemestre(semestre: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias/semestre/${semestre}`);
  }

  getMateriasByCreditos(minCreditos: number, maxCreditos: number): Observable<Materia[]> {
    const params = new HttpParams()
      .set('minCreditos', minCreditos.toString())
      .set('maxCreditos', maxCreditos.toString());
    return this.http.get<Materia[]>(`${this.apiUrl}/materias/creditos`, { params });
  }

  getMateriaByCodigo(codigo: string): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/materias/codigo/${codigo}`);
  }

  getMateriasByCarrera(carrera: string): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias/carrera/${carrera}`);
  }

  getMateriasByCarreraAndSemestre(carrera: string, semestre: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias/carrera/${carrera}/semestre/${semestre}`);
  }

  searchMaterias(searchTerm: string): Observable<Materia[]> {
    const params = new HttpParams().set('q', searchTerm);
    return this.http.get<Materia[]>(`${this.apiUrl}/materias/buscar`, { params });
  }

  // POST and PUT endpoints
  createMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(`${this.apiUrl}/materias`, materia);
  }

  updateMateria(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/materias/${id}`, materia);
  }

  deactivateMateria(id: number): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/materias/${id}/desactivar`, {});
  }

  activateMateria(id: number): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/materias/${id}/activar`, {});
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materias/${id}`);
  }

  // Assignment endpoints
  asignarMateria(materiaId: number, estudianteId: number, data: { fechaInicio: string, fechaFin?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/materias/${materiaId}/asignar/${estudianteId}`, data);
  }
}
