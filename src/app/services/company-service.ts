import { Injectable } from '@angular/core';
import { Company } from '../models/Company';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompany(): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/company`);
  }

  updateCompany(id: number, company: Company) {
    return this.http.put(`${this.apiUrl}/company/${id}`, company);
  }
}
