import { Component } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { Student } from '../../models/Student';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-students',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DividerModule,
    TagModule,
    InputTextModule,
  ],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  search: string = '';
  selectedStatus: string = 'Todos';
  resultsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  statuses: string[] = ['Todos', 'Activo', 'Inactivo'];
  selectedStudent: Student | null = null;
  loadingStudent: boolean = false;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService.getAllStudents().subscribe((students) => {
      this.students = students;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.students;
    
    if (this.selectedStatus !== 'Todos') {
      const isActive = this.selectedStatus === 'Activo';
      filtered = filtered.filter(s => s.activo === isActive);
    }
    
    if (this.search.trim()) {
      const searchTerm = this.search.toLowerCase();
      filtered = filtered.filter((s) =>
        s.nombreCompleto.toLowerCase().includes(searchTerm) ||
        s.matricula.toLowerCase().includes(searchTerm) ||
        s.carrera.toLowerCase().includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm)
      );
    }
    
    this.filteredStudents = filtered;
    this.totalPages =
      Math.ceil(this.filteredStudents.length / this.resultsPerPage) || 1;
    this.currentPage = 1;
  }

  get paginatedStudents() {
    const start = (this.currentPage - 1) * this.resultsPerPage;
    return this.filteredStudents.slice(start, start + this.resultsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  verEstudiante(student: Student) {
    this.loadingStudent = true;
    this.studentService.getStudent(student.id).subscribe({
      next: (detalle) => {
        this.selectedStudent = detalle;
        this.loadingStudent = false;
      },
      error: () => {
        alert('Error al cargar la información del estudiante');
        this.loadingStudent = false;
      },
    });
  }

  cerrarDetalle() {
    this.selectedStudent = null;
  }

  getStatusSeverity(activo: boolean): string {
    return activo ? 'success' : 'danger';
  }

  getStatusLabel(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
} 