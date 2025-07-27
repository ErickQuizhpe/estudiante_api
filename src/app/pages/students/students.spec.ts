import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Students } from './students';
import { StudentService } from '../../services/student-service';
import { of } from 'rxjs';
import { Student } from '../../models/Student';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Students', () => {
  let component: Students;
  let fixture: ComponentFixture<Students>;
  let studentService: jasmine.SpyObj<StudentService>;

  const mockStudents: Student[] = [
    {
      id: 1,
      title: 'Tarea 1',
      description: 'Descripción de la tarea 1',
      dueDate: '2024-01-15T10:00:00',
      assignedDate: '2024-01-01T10:00:00',
      maxScore: 100,
      score: 85,
      status: 'CALIFICADO',
      submissionFile: 'archivo1.pdf',
      feedback: 'Excelente trabajo',
      courseId: 1,
      studentId: 1,
      courseName: 'Matemáticas',
      studentName: 'Juan Pérez'
    },
    {
      id: 2,
      title: 'Tarea 2',
      description: 'Descripción de la tarea 2',
      dueDate: '2024-01-20T10:00:00',
      assignedDate: '2024-01-05T10:00:00',
      maxScore: 50,
      score: 0,
      status: 'PENDIENTE',
      submissionFile: '',
      feedback: '',
      courseId: 1,
      studentId: 2,
      courseName: 'Matemáticas',
      studentName: 'María García'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StudentService', [
      'getStudents',
      'getStudent'
    ]);

    await TestBed.configureTestingModule({
      imports: [Students, HttpClientTestingModule],
      providers: [
        { provide: StudentService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Students);
    component = fixture.componentInstance;
    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    studentService.getStudents.and.returnValue(of(mockStudents));
    
    component.ngOnInit();
    
    expect(studentService.getStudents).toHaveBeenCalled();
    expect(component.students).toEqual(mockStudents);
    expect(component.filteredStudents).toEqual(mockStudents);
  });

  it('should apply filters correctly', () => {
    component.students = mockStudents;
    component.selectedStatus = 'CALIFICADO';
    component.search = 'Tarea 1';
    
    component.applyFilters();
    
    expect(component.filteredStudents.length).toBe(1);
    expect(component.filteredStudents[0].title).toBe('Tarea 1');
  });

  it('should filter by status only', () => {
    component.students = mockStudents;
    component.selectedStatus = 'PENDIENTE';
    component.search = '';
    
    component.applyFilters();
    
    expect(component.filteredStudents.length).toBe(1);
    expect(component.filteredStudents[0].status).toBe('PENDIENTE');
  });

  it('should filter by search only', () => {
    component.students = mockStudents;
    component.selectedStatus = 'Todas';
    component.search = 'Juan';
    
    component.applyFilters();
    
    expect(component.filteredStudents.length).toBe(1);
    expect(component.filteredStudents[0].studentName).toBe('Juan Pérez');
  });

  it('should calculate pagination correctly', () => {
    component.students = mockStudents;
    component.resultsPerPage = 1;
    component.applyFilters();
    
    expect(component.totalPages).toBe(2);
    expect(component.paginatedStudents.length).toBe(1);
  });

  it('should navigate to page correctly', () => {
    component.students = mockStudents;
    component.resultsPerPage = 1;
    component.applyFilters();
    
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    
    component.goToPage(0);
    expect(component.currentPage).toBe(2); // Should not change
    
    component.goToPage(5);
    expect(component.currentPage).toBe(2); // Should not change
  });

  it('should view student details', () => {
    const student = mockStudents[0];
    studentService.getStudent.and.returnValue(of(student));
    
    component.verEstudiante(student);
    
    expect(studentService.getStudent).toHaveBeenCalledWith(student.id);
    expect(component.selectedStudent).toEqual(student);
    expect(component.loadingStudent).toBe(false);
  });

  it('should handle error when loading student details', () => {
    const student = mockStudents[0];
    spyOn(window, 'alert');
    studentService.getStudent.and.returnValue(of().pipe(() => {
      throw new Error('Error loading student');
    }));
    
    component.verEstudiante(student);
    
    expect(studentService.getStudent).toHaveBeenCalledWith(student.id);
    expect(component.loadingStudent).toBe(false);
  });

  it('should close student details', () => {
    component.selectedStudent = mockStudents[0];
    
    component.cerrarDetalle();
    
    expect(component.selectedStudent).toBeNull();
  });

  it('should get correct status severity', () => {
    expect(component.getStatusSeverity('PENDIENTE')).toBe('warning');
    expect(component.getStatusSeverity('ENVIADO')).toBe('info');
    expect(component.getStatusSeverity('CALIFICADO')).toBe('success');
    expect(component.getStatusSeverity('VENCIDO')).toBe('danger');
    expect(component.getStatusSeverity('OTRO')).toBe('secondary');
  });

  it('should format date correctly', () => {
    const dateString = '2024-01-15T10:30:00';
    const formatted = component.formatDate(dateString);
    
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
  });

  it('should return "No disponible" for empty date', () => {
    const result = component.formatDate('');
    expect(result).toBe('No disponible');
  });

  it('should calculate score percentage correctly', () => {
    const student = mockStudents[0]; // score: 85, maxScore: 100
    
    const percentage = component.getScorePercentage(student);
    
    expect(percentage).toBe(85);
  });

  it('should return 0 for score percentage when no score', () => {
    const student = { ...mockStudents[0], score: 0 };
    
    const percentage = component.getScorePercentage(student);
    
    expect(percentage).toBe(0);
  });

  it('should return 0 for score percentage when no maxScore', () => {
    const student = { ...mockStudents[0], maxScore: 0 };
    
    const percentage = component.getScorePercentage(student);
    
    expect(percentage).toBe(0);
  });
}); 