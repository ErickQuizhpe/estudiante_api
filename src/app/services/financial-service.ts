import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FinancialInfo, FinancialStatistics } from '../models/FinancialInfo';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET endpoints
  getAllFinancialInfo(): Observable<FinancialInfo[]> {
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera`);
  }

  getFinancialInfo(id: number): Observable<FinancialInfo> {
    return this.http.get<FinancialInfo>(`${this.apiUrl}/financiera/${id}`);
  }

  getFinancialInfoByStudent(estudianteId: number): Observable<FinancialInfo> {
    return this.http.get<FinancialInfo>(`${this.apiUrl}/financiera/estudiante/${estudianteId}`);
  }

  getStudentsWithDuesBetween(fechaInicio: string, fechaFin: string): Observable<FinancialInfo[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/vencimiento/entre`, { params });
  }

  getStudentsWithDuesBefore(fecha: string): Observable<FinancialInfo[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/vencimiento/antes`, { params });
  }

  getStudentsWithoutPaymentsAfter(fecha: string): Observable<FinancialInfo[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/sin-pagos-despues`, { params });
  }

  getStudentsByPensionRange(minPension: number, maxPension: number): Observable<FinancialInfo[]> {
    const params = new HttpParams()
      .set('minPension', minPension.toString())
      .set('maxPension', maxPension.toString());
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/pension/rango`, { params });
  }

  getStudentsWithPendingAmountGreaterThan(monto: number): Observable<FinancialInfo[]> {
    const params = new HttpParams().set('monto', monto.toString());
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/monto-pendiente`, { params });
  }

  getStudentsInArrears(): Observable<FinancialInfo[]> {
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/en-mora`);
  }

  getScholarshipStudents(): Observable<FinancialInfo[]> {
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/becados`);
  }

  getScholarshipStudentsByPercentage(porcentaje: number): Observable<FinancialInfo[]> {
    const params = new HttpParams().set('porcentaje', porcentaje.toString());
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/becados/porcentaje/${porcentaje}`, { params });
  }

  getCurrentStudents(): Observable<FinancialInfo[]> {
    return this.http.get<FinancialInfo[]>(`${this.apiUrl}/financiera/al-dia`);
  }

  // Statistics
  getTotalPendingAmount(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/financiera/estadisticas/monto-pendiente-total`);
  }

  getStudentsInArrearsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/financiera/estadisticas/count-en-mora`);
  }

  getScholarshipStudentsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/financiera/estadisticas/count-becados`);
  }

  // POST and PUT endpoints
  createFinancialInfo(financialInfo: FinancialInfo): Observable<FinancialInfo> {
    return this.http.post<FinancialInfo>(`${this.apiUrl}/financiera`, financialInfo);
  }

  updateFinancialInfo(id: number, financialInfo: FinancialInfo): Observable<FinancialInfo> {
    return this.http.put<FinancialInfo>(`${this.apiUrl}/financiera/${id}`, financialInfo);
  }

  registerPayment(id: number, montoPago: number): Observable<FinancialInfo> {
    const body = { monto: montoPago };
    return this.http.put<FinancialInfo>(`${this.apiUrl}/financiera/${id}/registrar-pago`, body);
  }

  deleteFinancialInfo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/financiera/${id}`);
  }
}
