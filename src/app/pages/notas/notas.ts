import { Component, OnInit } from '@angular/core';
import { NotaService } from '../../services/nota-service';
import { StudentService } from '../../services/student-service';
import { MateriaService } from '../../services/materia-service';
import { Nota } from '../../models/Nota';
import { Student } from '../../models/Student';
import { Materia } from '../../models/Materia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-notas',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    DialogModule,
    TableModule,
    InputNumberModule,
    CheckboxModule,
    TooltipModule
  ],
  templateUrl: './notas.html',
  styleUrl: './notas.css',
})
export class Notas implements OnInit {
  notas: Nota[] = [];
  filteredNotas: Nota[] = [];
  estudiantes: Student[] = [];
  materias: Materia[] = [];
  loading: boolean = true;
  
  // Filtros
  searchTerm: string = '';
  selectedEstudiante: number | null = null;
  selectedMateria: number | null = null;
  selectedTipoEvaluacion: string = '';
  selectedEstado: string = '';
  
  // Dialog para nueva nota
  showNewNotaDialog: boolean = false;
  editMode: boolean = false;
  selectedNota: Nota = this.getEmptyNota();
  
  // Opciones para filtros
  tiposEvaluacion: string[] = ['Examen', 'Quiz', 'Tarea', 'Proyecto', 'Participación', 'Laboratorio'];
  estados: any[] = [
    { label: 'Todas', value: '' },
    { label: 'Aprobadas', value: 'aprobado' },
    { label: 'Reprobadas', value: 'reprobado' },
    { label: 'Activas', value: 'activa' },
    { label: 'Inactivas', value: 'inactiva' }
  ];

  constructor(
    private notaService: NotaService,
    private studentService: StudentService,
    private materiaService: MateriaService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Cargar notas
    this.notaService.getAllNotas().subscribe({
      next: (notas) => {
        this.notas = notas;
        this.filteredNotas = [...notas];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notas:', error);
        this.loading = false;
      }
    });

    // Cargar estudiantes
    this.studentService.getAllStudents().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
      },
      error: (error) => {
        console.error('Error loading estudiantes:', error);
      }
    });

    // Cargar materias
    this.materiaService.getAllMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
      },
      error: (error) => {
        console.error('Error loading materias:', error);
      }
    });
  }

  applyFilters() {
    this.filteredNotas = this.notas.filter(nota => {
      const matchSearch = !this.searchTerm || 
        nota.estudianteNombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        nota.materiaNombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        nota.tipoEvaluacion?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchEstudiante = !this.selectedEstudiante || nota.estudianteId === this.selectedEstudiante;
      const matchMateria = !this.selectedMateria || nota.materiaId === this.selectedMateria;
      const matchTipo = !this.selectedTipoEvaluacion || nota.tipoEvaluacion === this.selectedTipoEvaluacion;
      
      let matchEstado = true;
      if (this.selectedEstado === 'aprobado') {
        matchEstado = nota.aprobada === true;
      } else if (this.selectedEstado === 'reprobado') {
        matchEstado = nota.aprobada === false;
      } else if (this.selectedEstado === 'activa') {
        matchEstado = nota.activo === true;
      } else if (this.selectedEstado === 'inactiva') {
        matchEstado = nota.activo === false;
      }

      return matchSearch && matchEstudiante && matchMateria && matchTipo && matchEstado;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedEstudiante = null;
    this.selectedMateria = null;
    this.selectedTipoEvaluacion = '';
    this.selectedEstado = '';
    this.filteredNotas = [...this.notas];
  }

  openNewNotaDialog() {
    // Para usuarios normales, esto no debería usarse
    console.log('Los estudiantes no pueden crear notas directamente');
  }

  viewNota(nota: Nota) {
    this.editMode = false;
    this.selectedNota = { ...nota };
    this.showNewNotaDialog = true;
  }

  editNota(nota: Nota) {
    this.viewNota(nota);
  }

  saveNota() {
    // Solo permitir actualizar observaciones para usuarios normales
    if (this.selectedNota.id && this.selectedNota.id > 0) {
      const notaToUpdate = {
        ...this.selectedNota,
        // Solo actualizar observaciones, mantener otros campos intactos
      };
      
      this.notaService.updateNota(this.selectedNota.id, notaToUpdate).subscribe({
        next: () => {
          this.loadData();
          this.closeDialog();
          alert('Comentario guardado exitosamente');
        },
        error: (error) => {
          console.error('Error updating nota:', error);
          alert('Error al guardar comentario');
        }
      });
    }
  }

  deleteNota(id: number) {
    if (confirm('¿Está seguro de que desea eliminar esta nota?')) {
      this.notaService.deleteNota(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (error) => {
          console.error('Error deleting nota:', error);
        }
      });
    }
  }

  closeDialog() {
    this.showNewNotaDialog = false;
    this.selectedNota = this.getEmptyNota();
  }

  getEmptyNota(): Nota {
    return {
      id: 0,
      valor: 0,
      tipoEvaluacion: '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      fechaRegistro: new Date().toISOString().split('T')[0],
      observaciones: '',
      activo: true,
      aprobada: false,
      reprobada: false,
      estudianteId: 0,
      estudianteNombre: '',
      materiaId: 0,
      materiaNombre: ''
    };
  }

  getEstadoSeverity(nota: Nota): string {
    if (!nota.activo) return 'secondary';
    return nota.aprobada ? 'success' : 'danger';
  }

  getEstadoText(nota: Nota): string {
    if (!nota.activo) return 'Inactiva';
    return nota.aprobada ? 'Aprobada' : 'Reprobada';
  }

  calculateAprobacion() {
    // Lógica para determinar si está aprobada (esto dependerá de tu regla de negocio)
    // Por ejemplo, si la nota es >= 7.0 sobre 10
    this.selectedNota.aprobada = this.selectedNota.valor >= 7.0;
    this.selectedNota.reprobada = !this.selectedNota.aprobada;
  }

  onEstudianteChange() {
    if (this.selectedNota.estudianteId) {
      const estudiante = this.estudiantes.find(e => e.id === this.selectedNota.estudianteId);
      if (estudiante) {
        this.selectedNota.estudianteNombre = `${estudiante.firstName} ${estudiante.lastName}`;
      }
    }
  }

  onMateriaChange() {
    if (this.selectedNota.materiaId) {
      const materia = this.materias.find(m => m.id === this.selectedNota.materiaId);
      if (materia) {
        this.selectedNota.materiaNombre = materia.nombre;
      }
    }
  }

  getEstudianteNombre(estudianteId: number): string {
    const estudiante = this.estudiantes.find(e => e.id === estudianteId);
    return estudiante ? `${estudiante.firstName} ${estudiante.lastName}` : 'Estudiante no encontrado';
  }

  getMateriaNombre(materiaId: number): string {
    const materia = this.materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : 'Materia no encontrada';
  }
}
