import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../../services/financial-service';
import { FinancialInfo } from '../../models/FinancialInfo';
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
export class Financial implements OnInit {
  financialInfo: FinancialInfo | null = null;
  loading: boolean = true;
  error: string = '';

  // Mock student ID - en un app real vendría del servicio de autenticación
  currentStudentId: number = 1;

  constructor(private financialService: FinancialService) {}

  ngOnInit() {
    this.loadFinancialInfo();
  }

  loadFinancialInfo() {
    this.loading = true;
    this.financialService.getFinancialInfoByStudent(this.currentStudentId).subscribe({
      next: (data) => {
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
    if (this.financialInfo.enMora || this.financialInfo.diasVencimiento < 0) return 'danger';
    if (this.financialInfo.montoPendiente === 0) return 'success';
    return 'warning';
  }

  getStatusLabel(): string {
    if (!this.financialInfo) return 'Sin información';
    if (this.financialInfo.enMora || this.financialInfo.diasVencimiento < 0) return 'En Mora';
    if (this.financialInfo.montoPendiente === 0) return 'Al Día';
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
