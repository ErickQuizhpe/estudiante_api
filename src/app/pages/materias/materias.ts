import { Component, OnInit } from '@angular/core';
import { MateriaService } from '../../services/materia-service';
import { Materia } from '../../models/Materia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-materias',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    DialogModule
  ],
  templateUrl: './materias.html',
  styleUrl: './materias.css',
})
export class Materias implements OnInit {
  materias: Materia[] = [];
  filteredMaterias: Materia[] = [];
  loading: boolean = true;
  selectedMateria: Materia | null = null;
  showDetails: boolean = false;
  
  // Filtros
  searchTerm: string = '';
  selectedCarrera: string = '';
  selectedSemestre: number | null = null;
  
  // Opciones para filtros
  carreras: string[] = [];
  semestres: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private materiaService: MateriaService) {}

  ngOnInit() {
    this.loadMaterias();
  }

  loadMaterias() {
    this.loading = true;
    this.materiaService.getAllMaterias().subscribe({
      next: (data) => {
        this.materias = data;
        this.extractCarreras();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading materias:', error);
        this.loading = false;
      }
    });
  }

  extractCarreras() {
    const carrerasSet = new Set(this.materias.map(m => m.carrera).filter(c => c));
    this.carreras = Array.from(carrerasSet).sort();
  }

  applyFilters() {
    let filtered = this.materias;

    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.nombre.toLowerCase().includes(term) ||
        m.codigo.toLowerCase().includes(term) ||
        m.descripcion?.toLowerCase().includes(term) ||
        m.carrera.toLowerCase().includes(term)
      );
    }

    // Filtro por carrera
    if (this.selectedCarrera) {
      filtered = filtered.filter(m => m.carrera === this.selectedCarrera);
    }

    // Filtro por semestre
    if (this.selectedSemestre !== null) {
      filtered = filtered.filter(m => m.semestre === this.selectedSemestre);
    }

    // Solo mostrar materias activas
    filtered = filtered.filter(m => m.activa);

    this.filteredMaterias = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCarrera = '';
    this.selectedSemestre = null;
    this.applyFilters();
  }

  viewDetails(materia: Materia) {
    this.selectedMateria = materia;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedMateria = null;
  }

  getEstadoSeverity(estado?: string): string {
    if (!estado) return 'success';
    switch (estado) {
      case 'ACTIVA': return 'success';
      case 'INACTIVA': return 'danger';
      case 'EN_PROCESO': return 'warning';
      default: return 'secondary';
    }
  }

  getModalidadIcon(modalidad?: string): string {
    if (!modalidad) return 'pi pi-building';
    switch (modalidad) {
      case 'PRESENCIAL': return 'pi pi-building';
      case 'VIRTUAL': return 'pi pi-desktop';
      case 'MIXTA': return 'pi pi-globe';
      default: return 'pi pi-question';
    }
  }

  getTipoColor(tipo?: string): string {
    if (!tipo) return '#6366f1';
    switch (tipo) {
      case 'OBLIGATORIA': return '#dc2626';
      case 'OPTATIVA': return '#059669';
      case 'PRACTICA': return '#d97706';
      default: return '#6366f1';
    }
  }

  getMateriasByCarrera(): { [key: string]: Materia[] } {
    const grouped: { [key: string]: Materia[] } = {};
    this.filteredMaterias.forEach(materia => {
      const carrera = materia.carrera || 'Sin Carrera';
      if (!grouped[carrera]) {
        grouped[carrera] = [];
      }
      grouped[carrera].push(materia);
    });
    return grouped;
  }

  getCarrerasKeys(): string[] {
    return Object.keys(this.getMateriasByCarrera()).sort();
  }
}
