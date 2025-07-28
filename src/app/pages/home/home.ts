import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { CompanyService } from '../../services/company-service';
import { Company, Banner } from '../../models/Company';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    ButtonModule,
    FormsModule,
    CarouselModule,
    TagModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  company = signal<Company | null>(null);
  banners = signal<Banner[]>([]);
  
  responsiveOptions = [
    {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '991px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    }
  ];

  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.loadCompanyData();
  }

  private loadCompanyData() {
    this.companyService.getCompany().subscribe({
      next: (company) => {
        this.company.set(company);
        // Filtrar solo banners activos
        const activeBanners = company.banners?.filter(banner => banner.active) || [];
        this.banners.set(activeBanners);
      },
      error: (error) => {
        console.error('Error loading company data:', error);
        // Cargar banners de fallback si no hay datos
        this.loadFallbackBanners();
      }
    });
  }

  private loadFallbackBanners() {
    const fallbackBanners: Banner[] = [
      {
        id: 1,
        imageUrl: 'https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=Bienvenido+al+Sistema+Académico',
        description: 'Sistema integral de gestión académica',
        active: true
      },
      {
        id: 2,
        imageUrl: 'https://via.placeholder.com/1200x400/059669/FFFFFF?text=Gestión+de+Estudiantes',
        description: 'Administra la información de estudiantes de manera eficiente',
        active: true
      },
      {
        id: 3,
        imageUrl: 'https://via.placeholder.com/1200x400/DC2626/FFFFFF?text=Catálogo+de+Materias',
        description: 'Explora nuestro amplio catálogo de materias académicas',
        active: true
      }
    ];
    this.banners.set(fallbackBanners);
  }
}
