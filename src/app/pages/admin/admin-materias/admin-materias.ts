import { Component, OnInit } from '@angular/core';
import { MateriaService } from '../../../services/materia-service';
import { StudentService } from '../../../services/student-service';
import { Materia } from '../../../models/Materia';
import { Student } from '../../../models/Student';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-admin-materias',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-materias.html',
  styleUrl: './admin-materias.css',
})
export class AdminMaterias implements OnInit {
  materias: Materia[] = [];
  students: Student[] = [];
  loading: boolean = true;
  
  // Dialog states
  materiaDialog: boolean = false;
  asignacionDialog: boolean = false;
  selectedMateria: Materia | null = null;
  
  // Form models
  materiaForm: Partial<Materia> = {};
  asignacionForm = {
    materiaId: null as number | null,
    estudianteId: null as number | null,
    fechaInicio: '' as string,
    fechaFin: '' as string
  };

  // Table filters
  globalFilter: string = '';

  constructor(
    private materiaService: MateriaService,
    private studentService: StudentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadMaterias();
    this.loadStudents();
  }

  loadMaterias() {
    this.loading = true;
    this.materiaService.getMaterias().subscribe({
      next: (data: Materia[]) => {
        this.materias = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las materias'
        });
        this.loading = false;
        console.error('Error loading materias:', error);
      }
    });
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
      },
      error: (error: any) => {
        console.error('Error loading students:', error);
      }
    });
  }

  openNew() {
    this.materiaForm = {
      estado: 'ACTIVA',
      modalidad: 'PRESENCIAL',
      tipoMateria: 'OBLIGATORIA',
      activa: true
    };
    this.materiaDialog = true;
  }

  editMateria(materia: Materia) {
    this.materiaForm = { ...materia };
    
    // Asegurar sincronización entre estado y activa
    if (!this.materiaForm.estado && this.materiaForm.activa !== undefined) {
      this.materiaForm.estado = this.materiaForm.activa ? 'ACTIVA' : 'INACTIVA';
    }
    if (!this.materiaForm.activa && this.materiaForm.estado) {
      this.materiaForm.activa = this.materiaForm.estado === 'ACTIVA';
    }
    
    this.materiaDialog = true;
  }

  deleteMateria(materia: Materia) {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar la materia "${materia.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materiaService.deleteMateria(materia.id!).subscribe({
          next: () => {
            this.materias = this.materias.filter(m => m.id !== materia.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Materia eliminada correctamente'
            });
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la materia'
            });
            console.error('Error deleting materia:', error);
          }
        });
      }
    });
  }

  saveMateria() {
    if (!this.materiaForm.nombre || !this.materiaForm.codigo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Nombre y código son requeridos'
      });
      return;
    }

    const materiaData = { ...this.materiaForm } as Materia;
    
    // Sincronizar estado y activa
    if (materiaData.estado === 'ACTIVA') {
      materiaData.activa = true;
    } else {
      materiaData.activa = false;
    }

    if (materiaData.id) {
      // Update existing materia
      this.materiaService.updateMateria(materiaData.id, materiaData).subscribe({
        next: (updatedMateria: Materia) => {
          const index = this.materias.findIndex(m => m.id === updatedMateria.id);
          if (index !== -1) {
            this.materias[index] = updatedMateria;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Materia actualizada correctamente'
          });
          this.materiaDialog = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la materia'
          });
          console.error('Error updating materia:', error);
        }
      });
    } else {
      // Create new materia
      this.materiaService.createMateria(materiaData).subscribe({
        next: (newMateria: Materia) => {
          this.materias.push(newMateria);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Materia creada correctamente'
          });
          this.materiaDialog = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la materia'
          });
          console.error('Error creating materia:', error);
        }
      });
    }
  }

  openAsignacion(materia: Materia) {
    this.selectedMateria = materia;
    this.asignacionForm = {
      materiaId: materia.id!,
      estudianteId: null,
      fechaInicio: '',
      fechaFin: ''
    };
    this.asignacionDialog = true;
  }

  saveAsignacion() {
    if (!this.asignacionForm.estudianteId || !this.asignacionForm.fechaInicio) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Estudiante y fecha de inicio son requeridos'
      });
      return;
    }

    this.materiaService.asignarMateria(
      this.asignacionForm.materiaId!,
      this.asignacionForm.estudianteId!,
      {
        fechaInicio: this.asignacionForm.fechaInicio,
        fechaFin: this.asignacionForm.fechaFin || undefined
      }
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Materia asignada correctamente'
        });
        this.asignacionDialog = false;
        this.loadMaterias(); // Refresh data
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo asignar la materia'
        });
        console.error('Error assigning materia:', error);
      }
    });
  }

  getEstadoSeverity(estado: string): string {
    switch (estado) {
      case 'ACTIVA': return 'success';
      case 'INACTIVA': return 'danger';
      case 'EN_PROCESO': return 'warning';
      default: return 'secondary';
    }
  }

  getModalidadIcon(modalidad: string): string {
    switch (modalidad) {
      case 'PRESENCIAL': return 'pi pi-building';
      case 'VIRTUAL': return 'pi pi-desktop';
      case 'MIXTA': return 'pi pi-globe';
      default: return 'pi pi-question';
    }
  }

  // Métodos para sincronizar estado y activa
  updateActivoFromEstado() {
    if (this.materiaForm.estado === 'ACTIVA') {
      this.materiaForm.activa = true;
    } else {
      this.materiaForm.activa = false;
    }
  }

  updateEstadoFromActivo() {
    if (this.materiaForm.activa) {
      this.materiaForm.estado = 'ACTIVA';
    } else {
      this.materiaForm.estado = 'INACTIVA';
    }
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.globalFilter = target.value;
  }
}
