import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-side-bar',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    PanelMenuModule,
    TooltipModule,
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  @Output() collapsedChange = new EventEmitter<boolean>();
  collapsed = false;
  visible: boolean = true;
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {
    this.initializeMenuItems();
  }

  private initializeMenuItems(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/admin',
        command: () => this.navigateTo('/admin'),
      },

      {
        label: 'Estudiantes',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Gestionar Estudiantes',
            icon: 'pi pi-user-edit',
            routerLink: '/admin/estudiantes',
            command: () => this.navigateTo('/admin/estudiantes'),
          },
        ],
      },
      {
        label: 'Académico',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Materias',
            icon: 'pi pi-list',
            routerLink: '/admin/materias',
            command: () => this.navigateTo('/admin/materias'),
          },
        ],
      },
      {
        label: 'Financiero',
        icon: 'pi pi-credit-card',
        items: [
          {
            label: 'Gestión Financiera',
            icon: 'pi pi-money-bill',
            routerLink: '/admin/financiero',
            command: () => this.navigateTo('/admin/financiero'),
          },
        ],
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-shield',
        items: [
          {
            label: 'Gestionar Usuarios',
            icon: 'pi pi-user-edit',
            routerLink: '/admin/usuarios',
            command: () => this.navigateTo('/admin/usuarios'),
          },
        ],
      },
      {
        label: 'Empresa',
        icon: 'pi pi-building',
        items: [
          {
            label: 'Información de la Empresa',
            icon: 'pi pi-info-circle',
            routerLink: '/admin/empresa',
            command: () => this.navigateTo('/admin/empresa'),
          },
        ],
      },
    ];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    // Implementar lógica de logout
    console.log('Logout clicked');
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
