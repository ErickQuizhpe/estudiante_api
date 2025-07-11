import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Recipes } from './pages/recipes/recipes';
import { AboutUs } from './pages/about-us/about-us';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { AdminGuard } from './guards/admin.guard';
import { AdminHome } from './pages/admin/admin-home/admin-home';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'recetas', component: Recipes },
      { path: 'nosotros', component: AboutUs },
      { path: 'contacto', component: Contact },
      { path: 'login', component: Login },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [{ path: '', component: AdminHome }],
    canActivate: [AdminGuard],
  },
  { path: '**', redirectTo: '' },
];
