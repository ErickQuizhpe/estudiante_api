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
        label: 'Recetas',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Gestionar Recetas',
            icon: 'pi pi-list',
            routerLink: '/admin/recetas',
            command: () => this.navigateTo('/admin/recetas'),
          },
        ],
      },
      {
        label: 'Categorías',
        icon: 'pi pi-tags',
        items: [
          {
            label: 'Gestionar Categorías',
            icon: 'pi pi-cog',
            routerLink: '/admin/categorias',
            command: () => this.navigateTo('/admin/categorias'),
          },
        ],
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
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
