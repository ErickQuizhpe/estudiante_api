import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { CompanyService } from '../../services/company-service';
import { Company } from '../../models/Company';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { User } from '../../models/User';
import { DarkModeSwitch } from '../dark-mode-switch/dark-mode-switch';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    MenubarModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    MenuModule,
    RouterModule,
    DarkModeSwitch,
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
      label: 'Materias',
      icon: 'pi pi-book',
      routerLink: '/materias',
    },
    {
      label: 'Notas',
      icon: 'pi pi-list',
      routerLink: '/notas',
    },
    {
      label: 'Financiero',
      icon: 'pi pi-credit-card',
      routerLink: '/financiero',
    },
    {
      label: 'Sobre nosotros',
      icon: 'pi pi-info-circle',
      routerLink: '/nosotros',
    },
    {
      label: 'Contacto',
      icon: 'pi pi-envelope',
      routerLink: '/contacto',
    },
  ];

  readonly company = signal<Company | null>(null);
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.companyService.getCompany().subscribe((company) => {
      this.company.set(company);
    });

    // Suscribirse a cambios en el usuario actual
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  logout(): void {
    this.authService.logout();
  }

  isInAdminArea(): boolean {
    return this.router.url.startsWith('/admin');
  }

  exitAdminArea(): void {
    this.router.navigate(['/']);
  }

  get userMenuItems(): any[] {
    const baseItems: any[] = [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate(['/perfil']);
        },
      },
    ];

    // Agregar opción específica según el área
    if (this.isInAdminArea()) {
      baseItems.push({
        label: 'Salir de Admin',
        icon: 'pi pi-arrow-left',
        command: () => {
          this.exitAdminArea();
        },
      });
    } else if (this.authService.isAdmin()) {
      baseItems.push({
        label: 'Panel de Admin',
        icon: 'pi pi-cog',
        command: () => {
          this.router.navigate(['/admin']);
        },
      });
    }

    baseItems.push(
      { separator: true },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      }
    );

    return baseItems;
  }
}
