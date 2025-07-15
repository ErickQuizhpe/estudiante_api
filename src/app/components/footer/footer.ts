import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Company } from '../../models/Company';
import { CompanyService } from '../../services/company-service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, DividerModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent implements OnInit {
  company: Company | null = null;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanyData();
  }

  private loadCompanyData(): void {
    this.companyService.getCompany().subscribe({
      next: (company) => {
        this.company = company;
      },
      error: (error) => {
        console.error('Error al cargar los datos de la empresa:', error);
      }
    });
  }
}
