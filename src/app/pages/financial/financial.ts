import { Component, OnInit, OnDestroy } from '@angular/core';
import { FinancialService } from '../../services/financial-service';
import { AuthService } from '../../services/auth-service';
import { StudentService } from '../../services/student-service';
import { FinancialInfo } from '../../models/FinancialInfo';
import { Student } from '../../models/Student';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-financial',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ProgressBarModule
  ],
  templateUrl: './financial.html',
  styleUrl: './financial.css',
})
export class Financial implements OnInit, OnDestroy {
  financialInfo: FinancialInfo | null = null;
  loading: boolean = true;
  error: string = '';

  private userSubscription?: Subscription;
  currentUserId: string | null = null;
  currentStudentId: number | null = null;
  currentStudent: Student | null = null;

  constructor(
    private financialService: FinancialService,
    private authService: AuthService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        console.log('🆔 Usuario logueado:', user);
        this.tryAlternativeStudentMethod();
      } else {
        this.tryLoadUserFromStorage();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private tryLoadUserFromStorage() {
    console.log('🔄 Intentando cargar usuario desde localStorage...');
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserId = currentUser.id;
      console.log('✅ Usuario cargado desde storage:', currentUser);
      this.tryAlternativeStudentMethod();
    } else {
      console.log('❌ No se encontró usuario en storage');
      this.error = 'No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.';
      this.loading = false;
    }
  }

  private tryAlternativeStudentMethod() {
    console.log('📚 Obteniendo lista de estudiantes...');
    
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        console.log('✅ Estudiantes obtenidos:', students.length);
        
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          console.log('👤 Buscando estudiante para usuario:', currentUser.email);
          
          // Buscar por email, username o nombre
          const student = students.find(s => 
            s.email === currentUser.email || 
            s.username === currentUser.username ||
            `${s.firstName} ${s.lastName}` === `${currentUser.firstName} ${currentUser.lastName}`
          );
          
          if (student) {
            console.log('✅ Estudiante encontrado:', student);
            this.currentStudent = student;
            this.currentStudentId = student.id!;
            this.loadFinancialInfo();
            return;
          }
        }
        
        // Si no encuentra coincidencia exacta, usar el primer estudiante
        if (students.length > 0) {
          console.warn('⚠️ No se encontró coincidencia exacta, usando primer estudiante');
          this.currentStudent = students[0];
          this.currentStudentId = students[0].id!;
          this.loadFinancialInfo();
        } else {
          console.log('❌ No hay estudiantes disponibles');
          this.error = 'No se encontraron estudiantes en el sistema.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener estudiantes:', error);
        this.error = 'Error al cargar información de estudiantes.';
        this.loading = false;
      }
    });
  }

  loadFinancialInfo() {
    if (!this.currentStudentId) {
      this.error = 'No se pudo identificar al estudiante.';
      this.loading = false;
      return;
    }

    console.log('💰 Cargando información financiera para estudiante ID:', this.currentStudentId);
    this.loading = true;
    this.financialService.getFinancialInfoByStudent(this.currentStudentId).subscribe({
      next: (data) => {
        console.log('💰 Datos financieros recibidos del API:', data);
        
        // Mapear los campos del API a los campos esperados por la UI
        this.financialInfo = {
          ...data,
          montoTotal: data.pensionMensual,
          montoPagado: data.pensionMensual - data.montoPendiente,
          fechaUltimoPago: data.ultimoPago,
          tieneDescuento: data.descuento > 0,
          porcentajeDescuento: data.descuento,
          esBecario: data.becado,
          enMora: data.diasVencimiento < 0,
          diasMora: data.diasVencimiento < 0 ? Math.abs(data.diasVencimiento) : 0,
          activo: true
        };
        
        console.log('💰 Información financiera procesada:', {
          montoPendiente: this.financialInfo.montoPendiente,
          diasVencimiento: this.financialInfo.diasVencimiento,
          enMora: this.financialInfo.enMora,
          status: this.getStatusLabel(),
          severity: this.getStatusSeverity()
        });
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'No se pudo cargar la información financiera';
        this.loading = false;
        console.error('Error loading financial info:', error);
      }
    });
  }

  getStatusSeverity(): string {
    if (!this.financialInfo) return 'secondary';
    
    console.log('🔍 Evaluando estado financiero:', {
      montoPendiente: this.financialInfo.montoPendiente,
      diasVencimiento: this.financialInfo.diasVencimiento,
      enMora: this.financialInfo.enMora
    });
    
    // Primero verificar si está en mora (días de vencimiento negativos)
    if (this.financialInfo.enMora || (this.financialInfo.diasVencimiento && this.financialInfo.diasVencimiento < 0)) {
      return 'danger';
    }
    
    // Si no debe nada, está al día
    if (this.financialInfo.montoPendiente === 0 || this.financialInfo.montoPendiente === null || this.financialInfo.montoPendiente === undefined) {
      return 'success';
    }
    
    // Si debe algo pero no está en mora, está pendiente
    return 'warning';
  }

  getStatusLabel(): string {
    if (!this.financialInfo) return 'Sin información';
    
    // Primero verificar si está en mora
    if (this.financialInfo.enMora || (this.financialInfo.diasVencimiento && this.financialInfo.diasVencimiento < 0)) {
      return 'En Mora';
    }
    
    // Si no debe nada, está al día
    if (this.financialInfo.montoPendiente === 0 || this.financialInfo.montoPendiente === null || this.financialInfo.montoPendiente === undefined) {
      return 'Al Día';
    }
    
    // Si debe algo pero no está en mora, está pendiente
    return 'Pendiente de Pago';
  }

  getPaymentProgress(): number {
    if (!this.financialInfo || !this.financialInfo.montoTotal || this.financialInfo.montoTotal === 0) return 0;
    return ((this.financialInfo.montoPagado || 0) / this.financialInfo.montoTotal) * 100;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDaysUntilDue(): number {
    if (!this.financialInfo?.fechaVencimiento) return 0;
    const today = new Date();
    const dueDate = new Date(this.financialInfo.fechaVencimiento);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDueDateSeverity(): string {
    const days = this.getDaysUntilDue();
    if (days < 0) return 'danger';
    if (days <= 7) return 'warning';
    return 'success';
  }
}
