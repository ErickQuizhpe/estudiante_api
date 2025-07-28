import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Notas } from './notas';
import { NotaService } from '../../services/nota-service';
import { StudentService } from '../../services/student-service';
import { MateriaService } from '../../services/materia-service';
import { Nota } from '../../models/Nota';
import { Student } from '../../models/Student';
import { Materia } from '../../models/Materia';

describe('NotasComponent', () => {
  let component: Notas;
  let fixture: ComponentFixture<Notas>;
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
    }
  ];

  beforeEach(async () => {
    const notaServiceSpy = jasmine.createSpyObj('NotaService', [
      'getAllNotas', 
      'createNota', 
      'updateNota', 
      'deleteNota'
    ]);
    const studentServiceSpy = jasmine.createSpyObj('StudentService', ['getAllStudents']);
    const materiaServiceSpy = jasmine.createSpyObj('MateriaService', ['getAllMaterias']);

    await TestBed.configureTestingModule({
      imports: [Notas],
      providers: [
        { provide: NotaService, useValue: notaServiceSpy },
        { provide: StudentService, useValue: studentServiceSpy },
        { provide: MateriaService, useValue: materiaServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Notas);
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
    expect(component.filteredNotas).toEqual([]);
    expect(component.loading).toBe(true);
    expect(component.searchTerm).toBe('');
    expect(component.selectedEstudiante).toBeNull();
    expect(component.selectedMateria).toBeNull();
  });

  it('should load data on init', () => {
    component.ngOnInit();

    expect(notaService.getAllNotas).toHaveBeenCalled();
    expect(studentService.getAllStudents).toHaveBeenCalled();
    expect(materiaService.getAllMaterias).toHaveBeenCalled();
    expect(component.notas).toEqual(mockNotas);
    expect(component.filteredNotas).toEqual(mockNotas);
    expect(component.estudiantes).toEqual(mockStudents);
    expect(component.materias).toEqual(mockMaterias);
    expect(component.loading).toBe(false);
  });

  it('should filter notas by search term', () => {
    component.notas = mockNotas;
    component.searchTerm = 'Juan';
    
    component.applyFilters();
    
    expect(component.filteredNotas.length).toBe(1);
    expect(component.filteredNotas[0].estudianteNombre).toContain('Juan');
  });

  it('should filter notas by estudiante', () => {
    component.notas = mockNotas;
    component.selectedEstudiante = 1;
    
    component.applyFilters();
    
    expect(component.filteredNotas.length).toBe(1);
    expect(component.filteredNotas[0].estudianteId).toBe(1);
  });

  it('should filter notas by materia', () => {
    component.notas = mockNotas;
    component.selectedMateria = 1;
    
    component.applyFilters();
    
    expect(component.filteredNotas.length).toBe(2);
    expect(component.filteredNotas.every(nota => nota.materiaId === 1)).toBe(true);
  });

  it('should filter notas by tipo evaluacion', () => {
    component.notas = mockNotas;
    component.selectedTipoEvaluacion = 'Examen';
    
    component.applyFilters();
    
    expect(component.filteredNotas.length).toBe(1);
    expect(component.filteredNotas[0].tipoEvaluacion).toBe('Examen');
  });

  it('should filter notas by estado aprobado', () => {
    component.notas = mockNotas;
    component.selectedEstado = 'aprobado';
    
    component.applyFilters();
    
    expect(component.filteredNotas.length).toBe(1);
    expect(component.filteredNotas[0].aprobada).toBe(true);
  });

  it('should filter notas by estado reprobado', () => {
    component.notas = mockNotas;
    component.selectedEstado = 'reprobado';
    
    component.applyFilters();
    
    expect(component.filteredNotas.length).toBe(1);
    expect(component.filteredNotas[0].aprobada).toBe(false);
  });

  it('should clear all filters', () => {
    component.searchTerm = 'test';
    component.selectedEstudiante = 1;
    component.selectedMateria = 1;
    component.selectedTipoEvaluacion = 'Examen';
    component.selectedEstado = 'aprobado';
    component.notas = mockNotas;
    
    component.clearFilters();
    
    expect(component.searchTerm).toBe('');
    expect(component.selectedEstudiante).toBeNull();
    expect(component.selectedMateria).toBeNull();
    expect(component.selectedTipoEvaluacion).toBe('');
    expect(component.selectedEstado).toBe('');
    expect(component.filteredNotas).toEqual(mockNotas);
  });

  it('should open new nota dialog', () => {
    component.openNewNotaDialog();
    
    expect(component.showNewNotaDialog).toBe(true);
    expect(component.editMode).toBe(false);
    expect(component.selectedNota.valor).toBe(0);
  });

  it('should open edit nota dialog', () => {
    const nota = mockNotas[0];
    
    component.editNota(nota);
    
    expect(component.showNewNotaDialog).toBe(true);
    expect(component.editMode).toBe(true);
    expect(component.selectedNota).toEqual(nota);
  });

  it('should close dialog', () => {
    component.showNewNotaDialog = true;
    component.selectedNota = mockNotas[0];
    
    component.closeDialog();
    
    expect(component.showNewNotaDialog).toBe(false);
    expect(component.selectedNota.valor).toBe(0);
  });

  it('should get correct estado severity', () => {
    const notaActiva = { ...mockNotas[0], activo: true, aprobada: true };
    const notaInactiva = { ...mockNotas[0], activo: false };
    const notaReprobada = { ...mockNotas[0], activo: true, aprobada: false };
    
    expect(component.getEstadoSeverity(notaActiva)).toBe('success');
    expect(component.getEstadoSeverity(notaInactiva)).toBe('secondary');
    expect(component.getEstadoSeverity(notaReprobada)).toBe('danger');
  });

  it('should get correct estado text', () => {
    const notaActiva = { ...mockNotas[0], activo: true, aprobada: true };
    const notaInactiva = { ...mockNotas[0], activo: false };
    const notaReprobada = { ...mockNotas[0], activo: true, aprobada: false };
    
    expect(component.getEstadoText(notaActiva)).toBe('Aprobada');
    expect(component.getEstadoText(notaInactiva)).toBe('Inactiva');
    expect(component.getEstadoText(notaReprobada)).toBe('Reprobada');
  });

  it('should calculate aprobacion correctly', () => {
    component.selectedNota.valor = 8.0;
    
    component.calculateAprobacion();
    
    expect(component.selectedNota.aprobada).toBe(true);
    expect(component.selectedNota.reprobada).toBe(false);
    
    component.selectedNota.valor = 5.0;
    
    component.calculateAprobacion();
    
    expect(component.selectedNota.aprobada).toBe(false);
    expect(component.selectedNota.reprobada).toBe(true);
  });

  it('should update estudiante info on change', () => {
    component.estudiantes = mockStudents;
    component.selectedNota.estudianteId = 1;
    
    component.onEstudianteChange();
    
    expect(component.selectedNota.estudianteNombre).toBe('Juan Pérez');
  });

  it('should update materia info on change', () => {
    component.materias = mockMaterias;
    component.selectedNota.materiaId = 1;
    
    component.onMateriaChange();
    
    expect(component.selectedNota.materiaNombre).toBe('Matemáticas');
  });

  it('should create nota when not in edit mode', () => {
    component.editMode = false;
    component.selectedNota = {
      id: 0,
      estudianteId: 1,
      materiaId: 1,
      valor: 8.0,
      tipoEvaluacion: 'Examen',
      fechaEvaluacion: '2025-01-15',
      fechaRegistro: '2025-01-15',
      observaciones: 'Test',
      aprobada: true,
      reprobada: false,
      activo: true,
      estudianteNombre: 'Juan Pérez',
      materiaNombre: 'Matemáticas'
    };
    
    notaService.createNota.and.returnValue(of(component.selectedNota));
    
    component.saveNota();
    
    expect(notaService.createNota).toHaveBeenCalledWith(component.selectedNota);
  });

  it('should update nota when in edit mode', () => {
    component.editMode = true;
    component.selectedNota = mockNotas[0];
    
    notaService.updateNota.and.returnValue(of(component.selectedNota));
    
    component.saveNota();
    
    expect(notaService.updateNota).toHaveBeenCalledWith(
      component.selectedNota.id!, 
      component.selectedNota
    );
  });

  it('should delete nota with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    notaService.deleteNota.and.returnValue(of(undefined));
    
    component.deleteNota(1);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(notaService.deleteNota).toHaveBeenCalledWith(1);
  });

  it('should not delete nota without confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteNota(1);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(notaService.deleteNota).not.toHaveBeenCalled();
  });

  it('should return empty nota object', () => {
    const emptyNota = component.getEmptyNota();
    
    expect(emptyNota.id).toBe(0);
    expect(emptyNota.valor).toBe(0);
    expect(emptyNota.activo).toBe(true);
    expect(emptyNota.aprobada).toBe(false);
    expect(emptyNota.reprobada).toBe(false);
  });
});
