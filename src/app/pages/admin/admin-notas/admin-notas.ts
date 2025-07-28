import { Component, OnInit } from '@angular/core';
import { NotaService } from '../../../services/nota-service';
import { StudentService } from '../../../services/student-service';
import { MateriaService } from '../../../services/materia-service';
import { Nota, PromedioEstudiante, PromedioMateria } from '../../../models/Nota';
import { Student } from '../../../models/Student';
import { Materia } from '../../../models/Materia';
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
  selector: 'app-admin-notas',
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
  templateUrl: './admin-notas.html',
  styleUrl: './admin-notas.css',
})
export class AdminNotas implements OnInit {
  notas: Nota[] = [];
  estudiantes: Student[] = [];
  materias: Materia[] = [];
  promediosEstudiantes: PromedioEstudiante[] = [];
  promediossMateria: PromedioMateria[] = [];
  loading: boolean = true;
  
  // Estadísticas
  estadisticas = {
    totalNotas: 0,
    notasAprobadas: 0,
    notasReprobadas: 0,
    promedioGeneral: 0,
    estudiantesConNotas: 0,
    materiasConNotas: 0
  };
  
  // Chart data
  chartDataTipoEvaluacion: any;
  chartDataAprobacion: any;
  chartDataPorMateria: any;
  chartOptions: any;
  
  // Filtros para reportes
  selectedEstudianteReport: number | null = null;
  selectedMateriaReport: number | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';
  
  // Bulk operations
  showBulkDialog: boolean = false;
  bulkNotas: any[] = [];
  selectedNotasForBulk: Nota[] = [];

  // Individual note CRUD operations
  showNotaDialog: boolean = false;
  showDeleteDialog: boolean = false;
  editMode: boolean = false;
  selectedNota: Nota = this.getEmptyNota();
  notaToDelete: Nota | null = null;
  
  // Opciones para filtros
  tiposEvaluacion: string[] = ['Examen', 'Quiz', 'Tarea', 'Proyecto', 'Participación', 'Laboratorio'];

  constructor(
    private notaService: NotaService,
    private studentService: StudentService,
    private materiaService: MateriaService
  ) {
    this.initChartOptions();
  }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;
    
    Promise.all([
      this.loadNotas(),
      this.loadEstudiantes(),
      this.loadMaterias()
    ]).then(() => {
      this.calculateStatistics();
      this.generateCharts();
      this.loading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.loading = false;
    });
  }

  async loadNotas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notaService.getAllNotas().subscribe({
        next: (notas) => {
          this.notas = notas;
          resolve();
        },
        error: reject
      });
    });
  }

  async loadEstudiantes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.studentService.getAllStudents().subscribe({
        next: (estudiantes) => {
          this.estudiantes = estudiantes;
          resolve();
        },
        error: reject
      });
    });
  }

  async loadMaterias(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.materiaService.getAllMaterias().subscribe({
        next: (materias) => {
          this.materias = materias;
          resolve();
        },
        error: reject
      });
    });
  }

  calculateStatistics() {
    this.estadisticas.totalNotas = this.notas.length;
    // Usar el campo correcto para aprobación
    this.estadisticas.notasAprobadas = this.notas.filter(n => n.aprobado || n.aprobada).length;
    this.estadisticas.notasReprobadas = this.notas.filter(n => !(n.aprobado || n.aprobada)).length;
    
    // Usar el campo correcto para el valor
    const sumaNotas = this.notas.reduce((sum, nota) => sum + (nota.calificacion || nota.valor || 0), 0);
    this.estadisticas.promedioGeneral = this.notas.length > 0 ? sumaNotas / this.notas.length : 0;
    
    const estudiantesUnicos = new Set(this.notas.map(n => n.estudianteId));
    this.estadisticas.estudiantesConNotas = estudiantesUnicos.size;
    
    const materiasUnicas = new Set(this.notas.map(n => n.materiaId));
    this.estadisticas.materiasConNotas = materiasUnicas.size;
  }

  generateCharts() {
    this.generateTipoEvaluacionChart();
    this.generateAprobacionChart();
    this.generatePorMateriaChart();
  }

  generateTipoEvaluacionChart() {
    const tiposCounts = this.notas.reduce((acc, nota) => {
      acc[nota.tipoEvaluacion] = (acc[nota.tipoEvaluacion] || 0) + 1;
      return acc;
    }, {} as any);

    this.chartDataTipoEvaluacion = {
      labels: Object.keys(tiposCounts),
      datasets: [{
        data: Object.values(tiposCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    };
  }

  generateAprobacionChart() {
    this.chartDataAprobacion = {
      labels: ['Aprobadas', 'Reprobadas'],
      datasets: [{
        data: [this.estadisticas.notasAprobadas, this.estadisticas.notasReprobadas],
        backgroundColor: ['#4CAF50', '#F44336']
      }]
    };
  }

  generatePorMateriaChart() {
    const materiasCounts = this.notas.reduce((acc, nota) => {
      const materiaName = nota.materiaNombre || `Materia ${nota.materiaId}`;
      acc[materiaName] = (acc[materiaName] || 0) + 1;
      return acc;
    }, {} as any);

    this.chartDataPorMateria = {
      labels: Object.keys(materiasCounts),
      datasets: [{
        label: 'Número de Notas',
        data: Object.values(materiasCounts),
        backgroundColor: '#42A5F5'
      }]
    };
  }

  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }

  exportReport() {
    // Implementar exportación a Excel/PDF
    console.log('Exportar reporte');
  }

  openBulkDialog() {
    this.showBulkDialog = true;
  }

  closeBulkDialog() {
    this.showBulkDialog = false;
    this.bulkNotas = [];
  }

  addBulkNota() {
    this.bulkNotas.push({
      estudianteId: 0,
      materiaId: 0,
      valor: 0,
      tipoEvaluacion: '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      observaciones: '',
      activo: true
    });
  }

  removeBulkNota(index: number) {
    this.bulkNotas.splice(index, 1);
  }

  saveBulkNotas() {
    const validNotas = this.bulkNotas.filter(nota => 
      nota.estudianteId && nota.materiaId && nota.tipoEvaluacion
    );

    Promise.all(
      validNotas.map(nota => 
        this.notaService.createNota(nota).toPromise()
      )
    ).then(() => {
      this.loadAllData();
      this.closeBulkDialog();
    }).catch(error => {
      console.error('Error saving bulk notas:', error);
    });
  }

  getPromedioByEstudiante(estudianteId: number): number {
    const notasEstudiante = this.notas.filter(n => n.estudianteId === estudianteId);
    if (notasEstudiante.length === 0) return 0;
    
    const suma = notasEstudiante.reduce((sum, nota) => sum + (nota.calificacion || nota.valor || 0), 0);
    return suma / notasEstudiante.length;
  }

  getPromedioByMateria(materiaId: number): number {
    const notasMateria = this.notas.filter(n => n.materiaId === materiaId);
    if (notasMateria.length === 0) return 0;
    
    const suma = notasMateria.reduce((sum, nota) => sum + (nota.calificacion || nota.valor || 0), 0);
    return suma / notasMateria.length;
  }

  generateDetailedReport() {
    const reporte = {
      fecha: new Date().toISOString(),
      estadisticas: this.estadisticas,
      promediosPorEstudiante: this.estudiantes.map(estudiante => ({
        estudiante: `${estudiante.firstName} ${estudiante.lastName}`,
        promedio: this.getPromedioByEstudiante(estudiante.id!),
        totalNotas: this.notas.filter(n => n.estudianteId === estudiante.id).length
      })),
      promediosPorMateria: this.materias.map(materia => ({
        materia: materia.nombre,
        promedio: this.getPromedioByMateria(materia.id!),
        totalNotas: this.notas.filter(n => n.materiaId === materia.id).length
      }))
    };

    // Aquí podrías implementar la descarga del reporte
    console.log('Reporte detallado:', reporte);
  }

  filterNotasByDateRange() {
    if (!this.fechaInicio || !this.fechaFin) return this.notas;
    
    return this.notas.filter(nota => 
      nota.fechaEvaluacion >= this.fechaInicio && 
      nota.fechaEvaluacion <= this.fechaFin
    );
  }

  getNotasCountByEstudiante(estudianteId: number): number {
    return this.notas.filter(nota => nota.estudianteId === estudianteId).length;
  }

  getNotasCountByMateria(materiaId: number): number {
    return this.notas.filter(nota => nota.materiaId === materiaId).length;
  }

  // CRUD Operations for individual notes
  getEmptyNota(): Nota {
    return {
      id: 0,
      calificacion: 0,
      valor: 0,
      notaMaxima: 100,
      porcentaje: 0,
      tipoEvaluacion: '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      fechaRegistro: new Date().toISOString().split('T')[0],
      observaciones: '',
      activa: true,
      activo: true,
      aprobado: false,
      aprobada: false,
      reprobada: false,
      estudianteId: 0,
      estudianteMatricula: '',
      estudianteNombre: '',
      materiaId: 0,
      materiaCodigo: '',
      materiaNombre: ''
    };
  }

  openNewNotaDialog() {
    this.editMode = false;
    this.selectedNota = this.getEmptyNota();
    this.showNotaDialog = true;
  }

  editNota(nota: Nota) {
    this.editMode = true;
    this.selectedNota = { ...nota };
    this.showNotaDialog = true;
  }

  saveNota() {
    // Calcular aprobación automáticamente y sincronizar campos
    this.selectedNota.aprobado = this.selectedNota.valor >= 70.0;
    this.selectedNota.aprobada = this.selectedNota.aprobado;
    this.selectedNota.reprobada = !this.selectedNota.aprobado;
    this.selectedNota.calificacion = this.selectedNota.valor;
    this.selectedNota.activa = this.selectedNota.activo;

    // Obtener nombres de estudiante y materia
    const estudiante = this.estudiantes.find(e => e.id === this.selectedNota.estudianteId);
    const materia = this.materias.find(m => m.id === this.selectedNota.materiaId);
    
    if (estudiante) {
      this.selectedNota.estudianteNombre = `${estudiante.firstName} ${estudiante.lastName}`;
    }
    if (materia) {
      this.selectedNota.materiaNombre = materia.nombre;
    }

    if (this.editMode) {
      this.notaService.updateNota(this.selectedNota.id!, this.selectedNota).subscribe({
        next: () => {
          this.loadAllData();
          this.closeNotaDialog();
          alert('Nota actualizada exitosamente');
        },
        error: (error) => {
          console.error('Error updating nota:', error);
          alert('Error al actualizar la nota');
        }
      });
    } else {
      this.notaService.createNota(this.selectedNota).subscribe({
        next: () => {
          this.loadAllData();
          this.closeNotaDialog();
          alert('Nota creada exitosamente');
        },
        error: (error) => {
          console.error('Error creating nota:', error);
          alert('Error al crear la nota');
        }
      });
    }
  }

  confirmDeleteNota(nota: Nota) {
    this.notaToDelete = nota;
    this.showDeleteDialog = true;
  }

  deleteNota() {
    if (this.notaToDelete && this.notaToDelete.id) {
      this.notaService.deleteNota(this.notaToDelete.id).subscribe({
        next: () => {
          this.loadAllData();
          this.closeDeleteDialog();
          alert('Nota eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error deleting nota:', error);
          alert('Error al eliminar la nota');
        }
      });
    }
  }

  closeNotaDialog() {
    this.showNotaDialog = false;
    this.selectedNota = this.getEmptyNota();
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.notaToDelete = null;
  }

  getEstadoSeverity(nota: Nota): string {
    if (!nota.activo) return 'secondary';
    return nota.aprobada ? 'success' : 'danger';
  }

  getEstadoText(nota: Nota): string {
    if (!nota.activo) return 'Inactiva';
    return nota.aprobada ? 'Aprobada' : 'Reprobada';
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

  calculateAprobacion() {
    this.selectedNota.aprobado = this.selectedNota.valor >= 70.0;
    this.selectedNota.aprobada = this.selectedNota.aprobado;
    this.selectedNota.reprobada = !this.selectedNota.aprobado;
    this.selectedNota.calificacion = this.selectedNota.valor; // Sincronizar valores
  }
}
