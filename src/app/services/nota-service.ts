import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Nota, PromedioEstudiante, PromedioMateria } from '../models/Nota';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET endpoints
  getAllNotas(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/notas`);
  }

  getNota(id: number): Observable<Nota> {
    return this.http.get<Nota>(`${this.apiUrl}/notas/${id}`);
  }

  getNotasByTipoEvaluacion(tipoEvaluacion: string): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/notas/tipo/${tipoEvaluacion}`);
  }

  getNotasByMateria(materiaId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/notas/materia/${materiaId}`);
  }

  getPromedioMateria(materiaId: number): Observable<{ promedio: number }> {
    return this.http.get<{ promedio: number }>(`${this.apiUrl}/notas/materia/${materiaId}/promedio`);
  }

  getNotasByFecha(fechaInicio: string, fechaFin: string): Observable<Nota[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<Nota[]>(`${this.apiUrl}/notas/fecha`, { params });
  }

  getNotasByEstudiante(estudianteId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/notas/estudiante/${estudianteId}`);
  }

  getNotasReprobadasByEstudiante(estudianteId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/notas/estudiante/${estudianteId}/reprobadas`);
  }

  getPromedioEstudiante(estudianteId: number): Observable<{ promedio: number }> {
    return this.http.get<{ promedio: number }>(`${this.apiUrl}/notas/estudiante/${estudianteId}/promedio`);
  }

  getNotasByEstudianteAndMateria(estudianteId: number, materiaId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/notas/estudiante/${estudianteId}/materia/${materiaId}`);
  }

  // POST and PUT endpoints
  createNota(nota: Nota): Observable<Nota> {
    return this.http.post<Nota>(`${this.apiUrl}/notas`, nota);
  }

  updateNota(id: number, nota: Nota): Observable<Nota> {
    return this.http.put<Nota>(`${this.apiUrl}/notas/${id}`, nota);
  }

  deleteNota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notas/${id}`);
  }
}
