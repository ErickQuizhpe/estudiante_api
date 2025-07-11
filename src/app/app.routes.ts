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
import { AdminRecipes } from './pages/admin/admin-recipes/admin-recipes';
import { AdminCategories } from './pages/admin/admin-categories/admin-categories';
import { AdminUsers } from './pages/admin/admin-users/admin-users';
import { AdminCompany } from './pages/admin/admin-company/admin-company';

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
    children: [
      { path: '', component: AdminHome },
      { path: 'recetas', component: AdminRecipes },
      { path: 'categorias', component: AdminCategories },
      { path: 'usuarios', component: AdminUsers },
      { path: 'empresa', component: AdminCompany },
    ],
    canActivate: [AdminGuard],
  },
  { path: '**', redirectTo: '' },
];
