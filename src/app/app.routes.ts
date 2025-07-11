import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Recipes } from './pages/recipes/recipes';
import { AboutUs } from './pages/about-us/about-us';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminHome } from './pages/admin/admin-home/admin-home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'recetas', component: Recipes, canActivate: [AuthGuard] },
  { path: 'nosotros', component: AboutUs },
  { path: 'contacto', component: Contact },
  { path: 'admin', component: AdminHome, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' },
];
