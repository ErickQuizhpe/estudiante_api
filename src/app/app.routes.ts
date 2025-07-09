import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Recipes } from './pages/recipes/recipes';
import { AboutUs } from './pages/about-us/about-us';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'recetas', component: Recipes },
  { path: 'nosotros', component: AboutUs },
  { path: 'contacto', component: Contact },
];
