import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminStudents } from './admin-students';
import { StudentService } from '../../../services/student-service';
import { of } from 'rxjs';
import { Student } from '../../../models/Student';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminStudents', () => {
  let component: AdminStudents;
  let fixture: ComponentFixture<AdminStudents>;
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
      'createStudent',
      'updateStudent',
      'deleteStudent',
      'gradeStudent'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminStudents, HttpClientTestingModule],
      providers: [
        { provide: StudentService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStudents);
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

  it('should open modal for editing', () => {
    const student = mockStudents[0];
    
    component.openModal(student);
    
    expect(component.showModal).toBe(true);
    expect(component.isEditing).toBe(true);
    expect(component.editingStudent).toBe(student);
    expect(component.formData.title).toBe(student.title);
  });

  it('should open modal for creating new student', () => {
    component.openModal();
    
    expect(component.showModal).toBe(true);
    expect(component.isEditing).toBe(false);
    expect(component.editingStudent).toBeNull();
    expect(component.formData.title).toBe('');
  });

  it('should close modal', () => {
    component.showModal = true;
    component.editingStudent = mockStudents[0];
    component.isEditing = true;
    
    component.closeModal();
    
    expect(component.showModal).toBe(false);
    expect(component.editingStudent).toBeNull();
    expect(component.isEditing).toBe(false);
  });

  it('should save new student', () => {
    const newStudent: Student = {
      id: 0,
      title: 'Nueva Tarea',
      description: 'Descripción',
      dueDate: '2024-02-01T10:00:00',
      assignedDate: new Date().toISOString(),
      maxScore: 100,
      score: 0,
      status: 'PENDIENTE',
      submissionFile: '',
      feedback: '',
      courseId: 1,
      studentId: 1,
      courseName: 'Matemáticas',
      studentName: 'Juan Pérez'
    };

    studentService.createStudent.and.returnValue(of(newStudent));
    studentService.getStudents.and.returnValue(of(mockStudents));
    
    component.formData = {
      title: 'Nueva Tarea',
      description: 'Descripción',
      dueDate: '2024-02-01T10:00',
      maxScore: 100,
      courseId: 1,
      studentId: 1,
      courseName: 'Matemáticas',
      studentName: 'Juan Pérez'
    };
    
    component.saveStudent();
    
    expect(studentService.createStudent).toHaveBeenCalled();
    expect(studentService.getStudents).toHaveBeenCalled();
  });

  it('should update existing student', () => {
    const updatedStudent = { ...mockStudents[0], title: 'Tarea Actualizada' };
    studentService.updateStudent.and.returnValue(of(updatedStudent));
    studentService.getStudents.and.returnValue(of(mockStudents));
    
    component.editingStudent = mockStudents[0];
    component.isEditing = true;
    component.formData = {
      title: 'Tarea Actualizada',
      description: 'Descripción actualizada',
      dueDate: '2024-01-15T10:00',
      maxScore: 100,
      courseId: 1,
      studentId: 1,
      courseName: 'Matemáticas',
      studentName: 'Juan Pérez'
    };
    
    component.saveStudent();
    
    expect(studentService.updateStudent).toHaveBeenCalledWith(mockStudents[0].id, jasmine.any(Object));
    expect(studentService.getStudents).toHaveBeenCalled();
  });

  it('should delete student', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    studentService.deleteStudent.and.returnValue(of(void 0));
    studentService.getStudents.and.returnValue(of(mockStudents));
    
    component.deleteStudent(mockStudents[0]);
    
    expect(studentService.deleteStudent).toHaveBeenCalledWith(mockStudents[0].id);
    expect(studentService.getStudents).toHaveBeenCalled();
  });

  it('should grade student', () => {
    spyOn(window, 'prompt').and.returnValue('85');
    studentService.gradeStudent.and.returnValue(of(mockStudents[0]));
    studentService.getStudents.and.returnValue(of(mockStudents));
    
    component.gradeStudent(mockStudents[0]);
    
    expect(studentService.gradeStudent).toHaveBeenCalledWith(mockStudents[0].id, 85);
    expect(studentService.getStudents).toHaveBeenCalled();
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
}); 