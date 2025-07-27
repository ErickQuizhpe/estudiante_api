import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../../../services/financial-service';
import { StudentService } from '../../../services/student-service';
import { FinancialInfo } from '../../../models/FinancialInfo';
import { Student } from '../../../models/Student';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-admin-financial',
  imports: [
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
  templateUrl: './admin-financial.html',
  styleUrl: './admin-financial.css',
})
export class AdminFinancial implements OnInit {
  financialInfos: FinancialInfo[] = [];
  filteredFinancialInfos: FinancialInfo[] = [];
  students: Student[] = [];
  
  search: string = '';
  selectedFilter: string = 'todos';
  
  // Modal
  showModal: boolean = false;
  showPaymentModal: boolean = false;
  editingFinancial: FinancialInfo | null = null;
  isEditing: boolean = false;
  
  // Form data
  formData = {
    estudianteId: 0,
    pensionMensual: 0,
    descuento: 0,
    montoPendiente: 0,
    fechaVencimiento: '',
    becado: false,
    porcentajeBeca: 0,
    observaciones: ''
  };

  // Payment form
  paymentData = {
    montoPago: 0
  };

  filterOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Al día', value: 'al-dia' },
    { label: 'En mora', value: 'en-mora' },
    { label: 'Becarios', value: 'becarios' },
    { label: 'Con descuento', value: 'con-descuento' }
  ];

  // Statistics
  statistics = {
    totalPendiente: 0,
    estudiantesEnMora: 0,
    estudiantesBecados: 0
  };

  constructor(
    private financialService: FinancialService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadStatistics();
  }

  loadData() {
    this.financialService.getAllFinancialInfo().subscribe(data => {
      this.financialInfos = data;
      this.applyFilters();
    });

    this.studentService.getStudents(true).subscribe(students => {
      this.students = students;
    });
  }

  loadStatistics() {
    this.financialService.getTotalPendingAmount().subscribe(data => {
      this.statistics.totalPendiente = data.total;
    });

    this.financialService.getStudentsInArrearsCount().subscribe(data => {
      this.statistics.estudiantesEnMora = data.count;
    });

    this.financialService.getScholarshipStudentsCount().subscribe(data => {
      this.statistics.estudiantesBecados = data.count;
    });
  }

  applyFilters() {
    let filtered = this.financialInfos;

    // Apply search filter
    if (this.search.trim()) {
      const searchTerm = this.search.toLowerCase();
      filtered = filtered.filter(f => 
        f.estudianteId.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    switch (this.selectedFilter) {
      case 'al-dia':
        filtered = filtered.filter(f => f.alDia && f.montoPendiente === 0);
        break;
      case 'en-mora':
        filtered = filtered.filter(f => !f.alDia || f.diasVencimiento < 0);
        break;
      case 'becarios':
        filtered = filtered.filter(f => f.becado);
        break;
      case 'con-descuento':
        filtered = filtered.filter(f => f.descuento > 0);
        break;
    }

    this.filteredFinancialInfos = filtered;
  }

  openModal(financial?: FinancialInfo) {
    this.isEditing = !!financial;
    this.editingFinancial = financial || null;
    
    if (financial) {
      this.formData = {
        estudianteId: financial.estudianteId,
        pensionMensual: financial.pensionMensual,
        descuento: financial.descuento,
        montoPendiente: financial.montoPendiente,
        fechaVencimiento: financial.fechaVencimiento ? new Date(financial.fechaVencimiento).toISOString().slice(0, 10) : '',
        becado: financial.becado,
        porcentajeBeca: financial.porcentajeBeca,
        observaciones: financial.observaciones
      };
    } else {
      this.formData = {
        estudianteId: 0,
        pensionMensual: 0,
        descuento: 0,
        montoPendiente: 0,
        fechaVencimiento: '',
        becado: false,
        porcentajeBeca: 0,
        observaciones: ''
      };
    }
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingFinancial = null;
    this.isEditing = false;
  }

  saveFinancial() {
    const financialData: FinancialInfo = {
      id: this.editingFinancial?.id || 0,
      estudianteId: this.formData.estudianteId,
      pensionMensual: this.formData.pensionMensual,
      descuento: this.formData.descuento,
      montoPendiente: this.formData.montoPendiente,
      ultimoPago: this.editingFinancial?.ultimoPago || '',
      fechaVencimiento: this.formData.fechaVencimiento,
      alDia: this.formData.montoPendiente === 0,
      becado: this.formData.becado,
      porcentajeBeca: this.formData.porcentajeBeca,
      observaciones: this.formData.observaciones,
      estudianteMatricula: this.editingFinancial?.estudianteMatricula || '',
      estudianteNombre: this.editingFinancial?.estudianteNombre || '',
      montoAPagar: this.formData.pensionMensual - this.formData.descuento,
      totalDescuento: this.formData.descuento,
      diasVencimiento: 0 // Se calculará automáticamente en el backend
    };

    if (this.isEditing && this.editingFinancial) {
      this.financialService.updateFinancialInfo(this.editingFinancial.id, financialData).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar información financiera:', error);
          alert('Error al actualizar la información financiera');
        }
      });
    } else {
      this.financialService.createFinancialInfo(financialData).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear información financiera:', error);
          alert('Error al crear la información financiera');
        }
      });
    }
  }

  openPaymentModal(financial: FinancialInfo) {
    this.editingFinancial = financial;
    this.paymentData.montoPago = 0;
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.editingFinancial = null;
  }

  registerPayment() {
    if (this.editingFinancial && this.paymentData.montoPago > 0) {
      this.financialService.registerPayment(this.editingFinancial.id, this.paymentData.montoPago).subscribe({
        next: () => {
          this.loadData();
          this.loadStatistics();
          this.closePaymentModal();
        },
        error: (error) => {
          console.error('Error al registrar pago:', error);
          alert('Error al registrar el pago');
        }
      });
    }
  }

  deleteFinancial(financial: FinancialInfo) {
    if (confirm(`¿Estás seguro de que quieres eliminar la información financiera del estudiante ${financial.estudianteId}?`)) {
      this.financialService.deleteFinancialInfo(financial.id).subscribe({
        next: () => {
          this.loadData();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Error al eliminar información financiera:', error);
          alert('Error al eliminar la información financiera');
        }
      });
    }
  }

  getStatusSeverity(financial: FinancialInfo): string {
    if (!financial.alDia || financial.diasVencimiento < 0) return 'danger';
    if (financial.montoPendiente === 0) return 'success';
    if (financial.becado) return 'info';
    return 'warning';
  }

  getStatusLabel(financial: FinancialInfo): string {
    if (!financial.alDia || financial.diasVencimiento < 0) return 'En Mora';
    if (financial.montoPendiente === 0) return 'Al Día';
    if (financial.becado) return 'Becario';
    return 'Pendiente';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  getStudentName(estudianteId: number): string {
    const student = this.students.find(s => s.id === estudianteId);
    return student ? student.nombreCompleto : `Estudiante ${estudianteId}`;
  }
}
