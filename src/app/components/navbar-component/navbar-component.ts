import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { CompanyService } from '../../services/company-service';
import { Company } from '../../models/Company';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenubarModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    RouterModule,
  ],
  templateUrl: './navbar-component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly items = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Recetas',
      icon: 'pi pi-book',
      routerLink: '/recetas',
    },
    {
      label: 'Sobre nosotros',
      icon: 'pi pi-users',
      routerLink: '/nosotros',
    },
    {
      label: 'Contacto',
      icon: 'pi pi-envelope',
      routerLink: '/contacto',
    },
  ];

  readonly company = signal<Company | null>(null);

  constructor(private readonly companyService: CompanyService) {
    this.companyService.getCompany().subscribe((company) => {
      this.company.set(company);
    });
  }

  toggleDarkMode(): void {
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');
  }
}
