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
