import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company-service';
import { Company } from '../../models/Company';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, CardModule, TagModule, DividerModule, AvatarModule],
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.css']
})
export class AboutUs implements OnInit {
  company?: Company;
  loading = true;
  error = '';

  // Datos de ejemplo para la estructura visual
  equipo: TeamMember[] = [
    {
      name: 'Juan Pablo',
      role: 'Chef Principal',
      description: 'Con más de 15 años de experiencia en cocina internacional. Misión: llevar el sabor casero a cualquier cocina.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Editor de Contenido',
      description: 'Periodista gastronómico con pasión por la escritura y la fotografía culinaria.',
      image: 'https://randomuser.me/api/portraits/men/44.jpg'
    },
    {
      name: 'Ana Martínez',
      role: 'Desarrolladora de Recetas',
      description: 'Especialista en adaptar recetas internacionales a ingredientes locales y distintos niveles de habilidad.',
      image: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
  ];

  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.companyService.getCompany().subscribe({
      next: (data) => {
        this.company = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la información de la empresa.';
        this.loading = false;
      }
    });
  }
}
