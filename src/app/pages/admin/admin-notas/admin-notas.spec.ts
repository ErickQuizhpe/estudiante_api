import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminNotas } from './admin-notas';
import { NotaService } from '../../../services/nota-service';
import { StudentService } from '../../../services/student-service';
import { MateriaService } from '../../../services/materia-service';
import { Nota } from '../../../models/Nota';
import { Student } from '../../../models/Student';
import { Materia } from '../../../models/Materia';

describe('AdminNotasComponent', () => {
  let component: AdminNotas;
  let fixture: ComponentFixture<AdminNotas>;
  let notaService: jasmine.SpyObj<NotaService>;
  let studentService: jasmine.SpyObj<StudentService>;
  let materiaService: jasmine.SpyObj<MateriaService>;

  const mockNotas: Nota[] = [
    {
      id: 1,
      estudianteId: 1,
      materiaId: 1,
      valor: 8.5,
      tipoEvaluacion: 'Examen',
      fechaEvaluacion: '2025-01-15',
      fechaRegistro: '2025-01-15',
      observaciones: 'Buen rendimiento',
      aprobada: true,
      reprobada: false,
      activo: true,
      estudianteNombre: 'Juan Pérez',
      materiaNombre: 'Matemáticas'
    },
    {
      id: 2,
      estudianteId: 2,
      materiaId: 1,
      valor: 5.0,
      tipoEvaluacion: 'Quiz',
      fechaEvaluacion: '2025-01-10',
      fechaRegistro: '2025-01-10',
      observaciones: 'Necesita mejorar',
      aprobada: false,
      reprobada: true,
      activo: true,
      estudianteNombre: 'María García',
      materiaNombre: 'Matemáticas'
    },
    {
      id: 3,
      estudianteId: 1,
      materiaId: 2,
      valor: 9.0,
      tipoEvaluacion: 'Proyecto',
      fechaEvaluacion: '2025-01-20',
      fechaRegistro: '2025-01-20',
      observaciones: 'Excelente trabajo',
      aprobada: true,
      reprobada: false,
      activo: true,
      estudianteNombre: 'Juan Pérez',
      materiaNombre: 'Física'
    }
  ];

  const mockStudents: Student[] = [
    {
      id: 1,
      matricula: 'EST001',
      telefono: '123456789',
      fechaNacimiento: '2000-01-01',
      carrera: 'Ingeniería',
      semestre: 3,
      fechaIngreso: '2023-01-01',
      activo: true,
      usuarioId: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      username: 'jperez',
      email: 'juan@example.com',
      fechaCreacion: '2023-01-01',
      ultimoAcceso: null,
      nombreCompleto: 'Juan Pérez',
      tieneInformacionFinanciera: false
    },
    {
      id: 2,
      matricula: 'EST002',
      telefono: '987654321',
      fechaNacimiento: '1999-05-15',
      carrera: 'Medicina',
      semestre: 2,
      fechaIngreso: '2023-01-01',
      activo: true,
      usuarioId: 2,
      firstName: 'María',
      lastName: 'García',
      username: 'mgarcia',
      email: 'maria@example.com',
      fechaCreacion: '2023-01-01',
      ultimoAcceso: null,
      nombreCompleto: 'María García',
      tieneInformacionFinanciera: true
    }
  ];

  const mockMaterias: Materia[] = [
    {
      id: 1,
      codigo: 'MAT101',
      nombre: 'Matemáticas',
      carrera: 'Ingeniería',
      semestre: 1,
      creditos: 4,
      descripcion: 'Matemáticas básicas',
      activa: true,
      estado: 'ACTIVA',
      tipoMateria: 'Obligatoria',
      modalidad: 'Presencial',
      fechaCreacion: '2023-01-01',
      fechaActualizacion: '2023-01-01'
    },
    {
      id: 2,
      codigo: 'FIS101',
      nombre: 'Física',
      carrera: 'Ingeniería',
      semestre: 1,
      creditos: 3,
      descripcion: 'Física general',
      activa: true,
      estado: 'ACTIVA',
      tipoMateria: 'Obligatoria',
      modalidad: 'Presencial',
      fechaCreacion: '2023-01-01',
      fechaActualizacion: '2023-01-01'
    }
  ];

  beforeEach(async () => {
    const notaServiceSpy = jasmine.createSpyObj('NotaService', [
      'getAllNotas', 
      'createNota'
    ]);
    const studentServiceSpy = jasmine.createSpyObj('StudentService', ['getAllStudents']);
    const materiaServiceSpy = jasmine.createSpyObj('MateriaService', ['getAllMaterias']);

    await TestBed.configureTestingModule({
      imports: [AdminNotas],
      providers: [
        { provide: NotaService, useValue: notaServiceSpy },
        { provide: StudentService, useValue: studentServiceSpy },
        { provide: MateriaService, useValue: materiaServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNotas);
    component = fixture.componentInstance;
    notaService = TestBed.inject(NotaService) as jasmine.SpyObj<NotaService>;
    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    materiaService = TestBed.inject(MateriaService) as jasmine.SpyObj<MateriaService>;

    // Setup default spy returns
    notaService.getAllNotas.and.returnValue(of(mockNotas));
    studentService.getAllStudents.and.returnValue(of(mockStudents));
    materiaService.getAllMaterias.and.returnValue(of(mockMaterias));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.notas).toEqual([]);
    expect(component.estudiantes).toEqual([]);
    expect(component.materias).toEqual([]);
    expect(component.loading).toBe(true);
    expect(component.showBulkDialog).toBe(false);
    expect(component.bulkNotas).toEqual([]);
  });

  it('should load all data on init', async () => {
    await component.ngOnInit();

    expect(notaService.getAllNotas).toHaveBeenCalled();
    expect(studentService.getAllStudents).toHaveBeenCalled();
    expect(materiaService.getAllMaterias).toHaveBeenCalled();
    expect(component.notas).toEqual(mockNotas);
    expect(component.estudiantes).toEqual(mockStudents);
    expect(component.materias).toEqual(mockMaterias);
    expect(component.loading).toBe(false);
  });

  it('should calculate statistics correctly', () => {
    component.notas = mockNotas;
    
    component.calculateStatistics();
    
    expect(component.estadisticas.totalNotas).toBe(3);
    expect(component.estadisticas.notasAprobadas).toBe(2);
    expect(component.estadisticas.notasReprobadas).toBe(1);
    expect(component.estadisticas.promedioGeneral).toBeCloseTo(7.5, 1);
    expect(component.estadisticas.estudiantesConNotas).toBe(2);
    expect(component.estadisticas.materiasConNotas).toBe(2);
  });

  it('should generate tipo evaluacion chart data', () => {
    component.notas = mockNotas;
    
    component.generateTipoEvaluacionChart();
    
    expect(component.chartDataTipoEvaluacion).toBeDefined();
    expect(component.chartDataTipoEvaluacion.labels).toContain('Examen');
    expect(component.chartDataTipoEvaluacion.labels).toContain('Quiz');
    expect(component.chartDataTipoEvaluacion.labels).toContain('Proyecto');
  });

  it('should generate aprobacion chart data', () => {
    component.estadisticas.notasAprobadas = 2;
    component.estadisticas.notasReprobadas = 1;
    
    component.generateAprobacionChart();
    
    expect(component.chartDataAprobacion).toBeDefined();
    expect(component.chartDataAprobacion.labels).toEqual(['Aprobadas', 'Reprobadas']);
    expect(component.chartDataAprobacion.datasets[0].data).toEqual([2, 1]);
    expect(component.chartDataAprobacion.datasets[0].backgroundColor).toEqual(['#4CAF50', '#F44336']);
  });

  it('should generate por materia chart data', () => {
    component.notas = mockNotas;
    
    component.generatePorMateriaChart();
    
    expect(component.chartDataPorMateria).toBeDefined();
    expect(component.chartDataPorMateria.labels).toContain('Matemáticas');
    expect(component.chartDataPorMateria.labels).toContain('Física');
  });

  it('should open bulk dialog', () => {
    component.openBulkDialog();
    
    expect(component.showBulkDialog).toBe(true);
  });

  it('should close bulk dialog', () => {
    component.showBulkDialog = true;
    component.bulkNotas = [{ estudianteId: 1, materiaId: 1 }];
    
    component.closeBulkDialog();
    
    expect(component.showBulkDialog).toBe(false);
    expect(component.bulkNotas).toEqual([]);
  });

  it('should add bulk nota', () => {
    const initialLength = component.bulkNotas.length;
    
    component.addBulkNota();
    
    expect(component.bulkNotas.length).toBe(initialLength + 1);
    expect(component.bulkNotas[0]).toEqual(jasmine.objectContaining({
      estudianteId: 0,
      materiaId: 0,
      valor: 0,
      tipoEvaluacion: '',
      activo: true
    }));
  });

  it('should remove bulk nota', () => {
    component.bulkNotas = [
      { estudianteId: 1, materiaId: 1 },
      { estudianteId: 2, materiaId: 2 }
    ];
    
    component.removeBulkNota(0);
    
    expect(component.bulkNotas.length).toBe(1);
    expect(component.bulkNotas[0]).toEqual({ estudianteId: 2, materiaId: 2 });
  });

  it('should save bulk notas', async () => {
    const validNota = {
      id: 0,
      estudianteId: 1,
      materiaId: 1,
      valor: 8.0,
      tipoEvaluacion: 'Examen',
      fechaEvaluacion: '2025-01-15',
      fechaRegistro: '2025-01-15',
      observaciones: '',
      aprobada: true,
      reprobada: false,
      activo: true
    };
    
    const invalidNota = {
      estudianteId: 0,
      materiaId: 0,
      valor: 0,
      tipoEvaluacion: '',
      fechaEvaluacion: '',
      observaciones: '',
      activo: true
    };
    
    component.bulkNotas = [validNota, invalidNota];
    notaService.createNota.and.returnValue(of(validNota as any));
    spyOn(component, 'loadAllData').and.stub();
    spyOn(component, 'closeBulkDialog');
    
    await component.saveBulkNotas();
    
    expect(notaService.createNota).toHaveBeenCalledTimes(1);
    expect(notaService.createNota).toHaveBeenCalledWith(jasmine.objectContaining({
      estudianteId: 1,
      materiaId: 1,
      valor: 8.0,
      tipoEvaluacion: 'Examen'
    }));
    expect(component.loadAllData).toHaveBeenCalled();
    expect(component.closeBulkDialog).toHaveBeenCalled();
  });

  it('should calculate promedio by estudiante', () => {
    component.notas = mockNotas;
    
    const promedio = component.getPromedioByEstudiante(1);
    
    expect(promedio).toBeCloseTo(8.75, 2); // (8.5 + 9.0) / 2
  });

  it('should return 0 for estudiante without notas', () => {
    component.notas = mockNotas;
    
    const promedio = component.getPromedioByEstudiante(999);
    
    expect(promedio).toBe(0);
  });

  it('should calculate promedio by materia', () => {
    component.notas = mockNotas;
    
    const promedio = component.getPromedioByMateria(1);
    
    expect(promedio).toBeCloseTo(6.75, 2); // (8.5 + 5.0) / 2
  });

  it('should return 0 for materia without notas', () => {
    component.notas = mockNotas;
    
    const promedio = component.getPromedioByMateria(999);
    
    expect(promedio).toBe(0);
  });

  it('should generate detailed report', () => {
    component.notas = mockNotas;
    component.estudiantes = mockStudents;
    component.materias = mockMaterias;
    component.estadisticas = {
      totalNotas: 3,
      notasAprobadas: 2,
      notasReprobadas: 1,
      promedioGeneral: 7.5,
      estudiantesConNotas: 2,
      materiasConNotas: 2
    };
    
    spyOn(console, 'log');
    
    component.generateDetailedReport();
    
    expect(console.log).toHaveBeenCalledWith('Reporte detallado:', jasmine.any(Object));
  });

  it('should filter notas by date range', () => {
    component.notas = mockNotas;
    component.fechaInicio = '2025-01-12';
    component.fechaFin = '2025-01-18';
    
    const filteredNotas = component.filterNotasByDateRange();
    
    expect(filteredNotas.length).toBe(1);
    expect(filteredNotas[0].fechaEvaluacion).toBe('2025-01-15');
  });

  it('should return all notas when no date range is set', () => {
    component.notas = mockNotas;
    component.fechaInicio = '';
    component.fechaFin = '';
    
    const filteredNotas = component.filterNotasByDateRange();
    
    expect(filteredNotas).toEqual(mockNotas);
  });

  it('should handle load data errors gracefully', async () => {
    notaService.getAllNotas.and.returnValue(of([]));
    studentService.getAllStudents.and.returnValue(of([]));
    materiaService.getAllMaterias.and.returnValue(of([]));
    
    spyOn(console, 'error');
    
    await component.ngOnInit();
    
    expect(component.loading).toBe(false);
    expect(component.notas).toEqual([]);
    expect(component.estudiantes).toEqual([]);
    expect(component.materias).toEqual([]);
  });

  it('should initialize chart options', () => {
    expect(component.chartOptions).toBeDefined();
    expect(component.chartOptions.responsive).toBe(true);
    expect(component.chartOptions.maintainAspectRatio).toBe(false);
    expect(component.chartOptions.plugins.legend.position).toBe('bottom');
  });
});
