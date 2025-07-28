import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
// Comentar temporalmente ChartModule hasta instalar chart.js
// import { ChartModule } from 'primeng/chart';
import { NotaService } from '../../../services/nota-service';
import { StudentService } from '../../../services/student-service';
import { MateriaService } from '../../../services/materia-service';
import { UserService } from '../../../services/user-service';

interface DashboardStats {
  totalEstudiantes: number;
  totalMaterias: number;
  totalNotas: number;
  totalUsuarios: number;
  promedioGeneral: number;
  estudiantesEnRiesgo: number;
  nuevosEstudiantes: number;
  materiasActivas: number;
  notasHoy: number;
  usuariosActivos: number;
  tendenciaPromedio: number;
}

interface Activity {
  type: string;
  icon: string;
  message: string;
  timestamp: Date;
}

interface Alert {
  id: string;
  severity: string;
  icon: string;
  title: string;
  message: string;
}

@Component({
  selector: 'app-admin-home',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule
    // ChartModule // Comentar temporalmente
  ],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {
  loading = true;
  
  stats: DashboardStats = {
    totalEstudiantes: 0,
    totalMaterias: 0,
    totalNotas: 0,
    totalUsuarios: 0,
    promedioGeneral: 0,
    estudiantesEnRiesgo: 0,
    nuevosEstudiantes: 0,
    materiasActivas: 0,
    notasHoy: 0,
    usuariosActivos: 0,
    tendenciaPromedio: 0
  };

  // Chart data
  chartNotasPorMes: any;
  chartDistribucionNotas: any;
  chartEstudiantesPorCarrera: any;
  chartRendimientoPorMateria: any;

  // Chart options
  chartOptions: any;
  doughnutOptions: any;
  barOptions: any;
  radarOptions: any;

  recentActivities: Activity[] = [];
  systemAlerts: Alert[] = [];

  constructor(
    private notaService: NotaService,
    private studentService: StudentService,
    private materiaService: MateriaService,
    private userService: UserService
  ) {
    this.initChartOptions();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.loading = true;
    
    try {
      await Promise.all([
        this.loadStats(),
        this.loadChartData(),
        this.loadRecentActivities(),
        this.loadSystemAlerts()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadStats() {
    try {
      const [estudiantes, materias, notas, usuarios] = await Promise.all([
        this.studentService.getAllStudents().toPromise(),
        this.materiaService.getAllMaterias().toPromise(),
        this.notaService.getAllNotas().toPromise(),
        this.userService.getUsers().toPromise()
      ]);

      this.stats.totalEstudiantes = estudiantes?.length || 0;
      this.stats.totalMaterias = materias?.length || 0;
      this.stats.totalNotas = notas?.length || 0;
      this.stats.totalUsuarios = usuarios?.length || 0;

      // Calcular promedio general
      if (notas && notas.length > 0) {
        const sumaNotas = notas.reduce((sum: any, nota: { calificacion: any; valor: any; }) => sum + (nota.calificacion || nota.valor || 0), 0);
        this.stats.promedioGeneral = sumaNotas / notas.length;
      }

      // Estudiantes en riesgo (promedio < 7.0)
      if (estudiantes && notas) {
        this.stats.estudiantesEnRiesgo = this.calculateStudentsAtRisk(estudiantes, notas);
      }

      // Datos adicionales simulados
      this.stats.nuevosEstudiantes = Math.floor(this.stats.totalEstudiantes * 0.1);
      this.stats.materiasActivas = Math.floor(this.stats.totalMaterias * 0.9);
      this.stats.notasHoy = Math.floor(Math.random() * 10) + 1;
      this.stats.usuariosActivos = Math.floor(this.stats.totalUsuarios * 0.8);
      this.stats.tendenciaPromedio = (Math.random() - 0.5) * 10;

    } catch (error) {
      console.error('Error loading stats:', error);
      // Usar datos simulados si hay error
      this.stats = {
        totalEstudiantes: 150,
        totalMaterias: 25,
        totalNotas: 500,
        totalUsuarios: 50,
        promedioGeneral: 14.5,
        estudiantesEnRiesgo: 15,
        nuevosEstudiantes: 12,
        materiasActivas: 22,
        notasHoy: 8,
        usuariosActivos: 45,
        tendenciaPromedio: 2.3
      };
    }
  }

  async loadChartData() {
    try {
      const notas = await this.notaService.getAllNotas().toPromise();
      if (!notas) return;

      this.generateNotasPorMesChart(notas);
      this.generateDistribucionNotasChart(notas);
      this.generateEstudiantesPorCarreraChart();
      this.generateRendimientoPorMateriaChart(notas);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  }

  generateNotasPorMesChart(notas: any[]) {
    // Agrupar notas por mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const notasPorMes = new Array(12).fill(0);
    
    notas.forEach(nota => {
      const fecha = new Date(nota.fechaEvaluacion);
      const mes = fecha.getMonth();
      notasPorMes[mes]++;
    });

    this.chartNotasPorMes = {
      labels: meses,
      datasets: [{
        label: 'Notas Registradas',
        data: notasPorMes,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.1)',
        tension: 0.4
      }]
    };
  }

  generateDistribucionNotasChart(notas: any[]) {
    const rangos = {
      'Excelente (18-20)': 0,
      'Muy Bueno (16-17)': 0,
      'Bueno (14-15)': 0,
      'Regular (12-13)': 0,
      'Deficiente (10-11)': 0,
      'Muy Deficiente (0-9)': 0
    };

    notas.forEach(nota => {
      const calificacion = nota.calificacion || nota.valor || 0;
      if (calificacion >= 18) rangos['Excelente (18-20)']++;
      else if (calificacion >= 16) rangos['Muy Bueno (16-17)']++;
      else if (calificacion >= 14) rangos['Bueno (14-15)']++;
      else if (calificacion >= 12) rangos['Regular (12-13)']++;
      else if (calificacion >= 10) rangos['Deficiente (10-11)']++;
      else rangos['Muy Deficiente (0-9)']++;
    });

    this.chartDistribucionNotas = {
      labels: Object.keys(rangos),
      datasets: [{
        data: Object.values(rangos),
        backgroundColor: [
          '#4CAF50',
          '#8BC34A',
          '#FFEB3B',
          '#FF9800',
          '#FF5722',
          '#F44336'
        ]
      }]
    };
  }

  generateEstudiantesPorCarreraChart() {
    // Datos simulados para carreras
    this.chartEstudiantesPorCarrera = {
      labels: ['Ingeniería', 'Medicina', 'Derecho', 'Administración', 'Psicología'],
      datasets: [{
        label: 'Estudiantes',
        data: [45, 32, 28, 38, 25],
        backgroundColor: '#66BB6A'
      }]
    };
  }

  generateRendimientoPorMateriaChart(notas: any[]) {
    // Agrupar por materia y calcular promedios
    const materias = ['Matemáticas', 'Física', 'Química', 'Historia', 'Literatura'];
    const promedios = materias.map(() => Math.random() * 8 + 12); // Simular promedios entre 12-20

    this.chartRendimientoPorMateria = {
      labels: materias,
      datasets: [{
        label: 'Promedio',
        data: promedios,
        borderColor: '#AB47BC',
        backgroundColor: 'rgba(171, 71, 188, 0.2)'
      }]
    };
  }

  async loadRecentActivities() {
    this.recentActivities = [
      {
        type: 'success',
        icon: 'pi pi-user-plus',
        message: 'Nuevo estudiante registrado: Juan Pérez',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        type: 'info',
        icon: 'pi pi-book',
        message: 'Materia "Cálculo II" actualizada',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        type: 'warning',
        icon: 'pi pi-exclamation-triangle',
        message: '5 estudiantes con notas pendientes',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        type: 'success',
        icon: 'pi pi-check',
        message: 'Backup del sistema completado',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];
  }

  async loadSystemAlerts() {
    this.systemAlerts = [
      {
        id: '1',
        severity: 'warning',
        icon: 'pi pi-exclamation-triangle',
        title: 'Mantenimiento Programado',
        message: 'El sistema tendrá mantenimiento el próximo domingo a las 2:00 AM'
      },
      {
        id: '2',
        severity: 'info',
        icon: 'pi pi-info-circle',
        title: 'Nueva Actualización',
        message: 'Hay una nueva versión disponible del sistema'
      }
    ];
  }

  calculateStudentsAtRisk(estudiantes: any[], notas: any[]): number {
    let estudiantesEnRiesgo = 0;
    
    estudiantes.forEach(estudiante => {
      const notasEstudiante = notas.filter(nota => nota.estudianteId === estudiante.id);
      if (notasEstudiante.length > 0) {
        const promedio = notasEstudiante.reduce((sum, nota) => 
          sum + (nota.calificacion || nota.valor || 0), 0) / notasEstudiante.length;
        if (promedio < 7.0) {
          estudiantesEnRiesgo++;
        }
      }
    });
    
    return estudiantesEnRiesgo;
  }

  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    this.doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    };

    this.barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    this.radarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 20
        }
      }
    };
  }

  dismissAlert(alert: Alert) {
    this.systemAlerts = this.systemAlerts.filter(a => a.id !== alert.id);
  }
}
