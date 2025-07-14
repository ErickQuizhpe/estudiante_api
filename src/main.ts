import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Inicializar el tema antes de arrancar la aplicación
function initializeTheme() {
  const savedTheme = localStorage.getItem('darkMode');
  const isDark = savedTheme === 'true';
  const element = document.querySelector('html');

  if (isDark) {
    element?.classList.add('dark-mode');
  } else {
    element?.classList.remove('dark-mode');
  }
}

// Cargar el tema guardado
initializeTheme();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
