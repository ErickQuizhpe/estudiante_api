import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Students } from './pages/students/students';
import { Materias } from './pages/materias/materias';
import { AboutUs } from './pages/about-us/about-us';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Financial } from './pages/financial/financial';
import { AdminGuard } from './guards/admin.guard';
import { AdminHome } from './pages/admin/admin-home/admin-home';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminUsers } from './pages/admin/admin-users/admin-users';
import { AdminCompany } from './pages/admin/admin-company/admin-company';
import { AdminStudents } from './pages/admin/admin-students/admin-students';
import { AdminFinancial } from './pages/admin/admin-financial/admin-financial';
import { AdminMaterias } from './pages/admin/admin-materias/admin-materias';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'estudiantes', component: Students },
      { path: 'materias', component: Materias },
      { path: 'financiero', component: Financial },
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
      { path: 'estudiantes', component: AdminStudents },
      { path: 'usuarios', component: AdminUsers },
      { path: 'empresa', component: AdminCompany },
      { path: 'financiero', component: AdminFinancial },
      { path: 'materias', component: AdminMaterias },
    ],
    canActivate: [AdminGuard],
  },
  { path: '**', redirectTo: '' },
];
