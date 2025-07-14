import { Component, inject, signal, OnInit } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dark-mode-switch',
  imports: [ToggleSwitchModule, FormsModule],
  templateUrl: './dark-mode-switch.html',
  styleUrl: './dark-mode-switch.css',
})
export class DarkModeSwitch implements OnInit {
  isDarkMode = signal(false);
  isDarkModeValue = false;

  ngOnInit() {
    // Cargar el tema guardado del localStorage
    const savedTheme = localStorage.getItem('darkMode');
    const isDark = savedTheme === 'true';
    this.isDarkMode.set(isDark);
    this.isDarkModeValue = isDark;
    this.applyTheme(isDark);
  }

  onThemeChange(event: any) {
    const isChecked = event.checked;
    this.isDarkMode.set(isChecked);
    this.isDarkModeValue = isChecked;
    this.applyTheme(isChecked);
    // Guardar en localStorage
    localStorage.setItem('darkMode', isChecked.toString());
  }

  toggleDarkMode() {
    const newValue = !this.isDarkMode();
    this.onThemeChange({ checked: newValue });
  }

  private applyTheme(isDark: boolean) {
    const element = document.querySelector('html');
    if (isDark) {
      element?.classList.add('dark-mode');
    } else {
      element?.classList.remove('dark-mode');
    }
  }
}
