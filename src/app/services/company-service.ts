import { Injectable } from '@angular/core';
import { Company, SocialMedia, Banner } from '../models/Company';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompany(): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/company`);
  }

  updateCompany(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/company/${id}`, company);
  }

  // Social Media methods - handled locally since no API endpoints exist
  createSocialMedia(companyId: number, socialMedia: Omit<SocialMedia, 'id'>): Observable<SocialMedia> {
    // Generate a temporary ID for the new social media
    const newSocialMedia: SocialMedia = {
      ...socialMedia,
      id: Date.now() // Use timestamp as temporary ID
    };
    return of(newSocialMedia);
  }

  updateSocialMedia(companyId: number, socialMediaId: number, socialMedia: SocialMedia): Observable<SocialMedia> {
    // Return the updated social media object
    return of(socialMedia);
  }

  deleteSocialMedia(companyId: number, socialMediaId: number): Observable<void> {
    // Return success for local deletion
    return of(undefined);
  }

  // Banner methods - handled locally since no API endpoints exist
  createBanner(companyId: number, banner: Omit<Banner, 'id'>): Observable<Banner> {
    // Generate a temporary ID for the new banner
    const newBanner: Banner = {
      ...banner,
      id: Date.now() // Use timestamp as temporary ID
    };
    return of(newBanner);
  }

  updateBanner(companyId: number, bannerId: number, banner: Banner): Observable<Banner> {
    // Return the updated banner object
    return of(banner);
  }

  deleteBanner(companyId: number, bannerId: number): Observable<void> {
    // Return success for local deletion
    return of(undefined);
  }

  // Method to save complete company with social media and banners
  saveCompleteCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/company/${company.id}`, company);
  }
}
