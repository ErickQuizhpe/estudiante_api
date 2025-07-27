import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFinancial } from './admin-financial';
import { FinancialService } from '../../../services/financial-service';
import { StudentService } from '../../../services/student-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { of } from 'rxjs';

describe('AdminFinancial', () => {
  let component: AdminFinancial;
  let fixture: ComponentFixture<AdminFinancial>;
  let financialService: jasmine.SpyObj<FinancialService>;
  let studentService: jasmine.SpyObj<StudentService>;

  const mockFinancialInfo = [
    {
      id: 1,
      pensionMensual: 250,
      descuento: 25,
      montoPendiente: 150,
      ultimoPago: '2025-06-15',
      fechaVencimiento: '2025-08-15',
      alDia: false,
      becado: true,
      porcentajeBeca: 25,
      observaciones: 'Beca por excelencia académica',
      estudianteId: 1,
      estudianteMatricula: 'EST2025001',
      estudianteNombre: 'Juan Carlos Pérez González',
      montoAPagar: 187.5,
      totalDescuento: 62.5,
      diasVencimiento: -19
    }
  ];

  const mockStudents = [
    {
      id: 1,
      matricula: 'EST2025001',
      telefono: '1234567890',
      fechaNacimiento: '2000-05-15',
      carrera: 'Ingeniería en Sistemas',
      semestre: 6,
      fechaIngreso: '2023-08-15',
      activo: true,
      usuarioId: 1,
      firstName: 'Juan Carlos',
      lastName: 'Pérez González',
      username: 'juan.perez',
      email: 'juan.perez@email.com',
      fechaCreacion: '2023-08-15T10:00:00Z',
      ultimoAcceso: '2025-01-20T14:30:00Z',
      nombreCompleto: 'Juan Carlos Pérez González',
      tieneInformacionFinanciera: true
    }
  ];

  beforeEach(async () => {
    const financialServiceSpy = jasmine.createSpyObj('FinancialService', [
      'getAllFinancialInfo',
      'getTotalPendingAmount',
      'getStudentsInArrearsCount',
      'getScholarshipStudentsCount',
      'updateFinancialInfo',
      'createFinancialInfo',
      'registerPayment',
      'deleteFinancialInfo'
    ]);

    const studentServiceSpy = jasmine.createSpyObj('StudentService', ['getStudents']);

    await TestBed.configureTestingModule({
      imports: [
        AdminFinancial,
        HttpClientTestingModule,
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        TableModule,
        TagModule,
        InputTextModule,
        DialogModule,
        TooltipModule,
        InputNumberModule
      ],
      providers: [
        { provide: FinancialService, useValue: financialServiceSpy },
        { provide: StudentService, useValue: studentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFinancial);
    component = fixture.componentInstance;
    financialService = TestBed.inject(FinancialService) as jasmine.SpyObj<FinancialService>;
    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;

    // Setup default return values
    financialService.getAllFinancialInfo.and.returnValue(of(mockFinancialInfo));
    financialService.getTotalPendingAmount.and.returnValue(of({ total: 1500 }));
    financialService.getStudentsInArrearsCount.and.returnValue(of({ count: 5 }));
    financialService.getScholarshipStudentsCount.and.returnValue(of({ count: 3 }));
    studentService.getStudents.and.returnValue(of(mockStudents));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and load data on ngOnInit', () => {
    component.ngOnInit();

    expect(financialService.getAllFinancialInfo).toHaveBeenCalled();
    expect(studentService.getStudents).toHaveBeenCalledWith(true);
    expect(financialService.getTotalPendingAmount).toHaveBeenCalled();
    expect(financialService.getStudentsInArrearsCount).toHaveBeenCalled();
    expect(financialService.getScholarshipStudentsCount).toHaveBeenCalled();
  });

  it('should apply filters correctly', () => {
    component.financialInfos = mockFinancialInfo;
    component.selectedFilter = 'becarios';
    
    component.applyFilters();
    
    expect(component.filteredFinancialInfos.length).toBe(1);
    expect(component.filteredFinancialInfos[0].becado).toBe(true);
  });

  it('should open modal for new financial info', () => {
    component.openModal();
    
    expect(component.showModal).toBe(true);
    expect(component.isEditing).toBe(false);
    expect(component.formData.estudianteId).toBe(0);
  });

  it('should open modal for editing financial info', () => {
    const financial = mockFinancialInfo[0];
    component.openModal(financial);
    
    expect(component.showModal).toBe(true);
    expect(component.isEditing).toBe(true);
    expect(component.editingFinancial).toBe(financial);
  });

  it('should get correct status severity', () => {
    const financial = mockFinancialInfo[0];
    
    const severity = component.getStatusSeverity(financial);
    
    expect(severity).toBe('danger'); // Because diasVencimiento < 0
  });

  it('should get correct status label', () => {
    const financial = mockFinancialInfo[0];
    
    const label = component.getStatusLabel(financial);
    
    expect(label).toBe('En Mora'); // Because diasVencimiento < 0
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(250);
    
    expect(formatted).toBe('$250.00');
  });

  it('should format date correctly', () => {
    const formatted = component.formatDate('2025-08-15');
    
    expect(formatted).toContain('2025');
  });

  it('should get student name correctly', () => {
    component.students = mockStudents;
    
    const name = component.getStudentName(1);
    
    expect(name).toBe('Juan Carlos Pérez González');
  });

  it('should return default student name for unknown ID', () => {
    component.students = mockStudents;
    
    const name = component.getStudentName(999);
    
    expect(name).toBe('Estudiante 999');
  });

  it('should close modal', () => {
    component.showModal = true;
    component.editingFinancial = mockFinancialInfo[0];
    component.isEditing = true;
    
    component.closeModal();
    
    expect(component.showModal).toBe(false);
    expect(component.editingFinancial).toBeNull();
    expect(component.isEditing).toBe(false);
  });

  it('should open payment modal', () => {
    const financial = mockFinancialInfo[0];
    
    component.openPaymentModal(financial);
    
    expect(component.showPaymentModal).toBe(true);
    expect(component.editingFinancial).toBe(financial);
    expect(component.paymentData.montoPago).toBe(0);
  });

  it('should close payment modal', () => {
    component.showPaymentModal = true;
    component.editingFinancial = mockFinancialInfo[0];
    
    component.closePaymentModal();
    
    expect(component.showPaymentModal).toBe(false);
    expect(component.editingFinancial).toBeNull();
  });
});
