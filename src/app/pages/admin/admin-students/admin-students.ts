import { Component } from '@angular/core';
import { StudentService } from '../../../services/student-service';
import { Student } from '../../../models/Student';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-admin-students',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DividerModule,
    TagModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
  ],
  templateUrl: './admin-students.html',
  styleUrl: './admin-students.css',
})
export class AdminStudents {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  search: string = '';
  resultsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  
  // Variables para el modal
  showModal: boolean = false;
  editingStudent: Student | null = null;
  isEditing: boolean = false;

  // Formulario
  formData = {
    matricula: '',
    telefono: '',
    fechaNacimiento: '',
    carrera: '',
    semestre: 1,
    fechaIngreso: '',
    firstName: '',
    lastName: '',
    username: '',
    email: ''
  };

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe((students) => {
      this.students = students;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.students;
    
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

  openModal(student?: Student) {
    this.isEditing = !!student;
    this.editingStudent = student || null;
    
    if (student) {
      this.formData = {
        matricula: student.matricula,
        telefono: student.telefono,
        fechaNacimiento: student.fechaNacimiento ? new Date(student.fechaNacimiento).toISOString().slice(0, 10) : '',
        carrera: student.carrera,
        semestre: student.semestre,
        fechaIngreso: student.fechaIngreso ? new Date(student.fechaIngreso).toISOString().slice(0, 10) : '',
        firstName: student.firstName,
        lastName: student.lastName,
        username: student.username,
        email: student.email
      };
    } else {
      this.formData = {
        matricula: '',
        telefono: '',
        fechaNacimiento: '',
        carrera: '',
        semestre: 1,
        fechaIngreso: '',
        firstName: '',
        lastName: '',
        username: '',
        email: ''
      };
    }
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingStudent = null;
    this.isEditing = false;
  }

  saveStudent() {
    if (this.isEditing && this.editingStudent) {
      const updatedStudent: Student = {
        ...this.editingStudent,
        matricula: this.formData.matricula,
        telefono: this.formData.telefono,
        fechaNacimiento: this.formData.fechaNacimiento,
        carrera: this.formData.carrera,
        semestre: this.formData.semestre,
        fechaIngreso: this.formData.fechaIngreso,
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        username: this.formData.username,
        email: this.formData.email,
        nombreCompleto: `${this.formData.firstName} ${this.formData.lastName}`
      };
      
      this.studentService.updateStudent(this.editingStudent.id, updatedStudent).subscribe({
        next: () => {
          this.loadStudents();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar estudiante:', error);
          alert('Error al actualizar el estudiante');
        }
      });
    } else {
      const newStudent: Student = {
        id: 0,
        matricula: this.formData.matricula,
        telefono: this.formData.telefono,
        fechaNacimiento: this.formData.fechaNacimiento,
        carrera: this.formData.carrera,
        semestre: this.formData.semestre,
        fechaIngreso: this.formData.fechaIngreso,
        activo: true,
        usuarioId: 0,
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        username: this.formData.username,
        email: this.formData.email,
        fechaCreacion: new Date().toISOString(),
        ultimoAcceso: null,
        nombreCompleto: `${this.formData.firstName} ${this.formData.lastName}`,
        tieneInformacionFinanciera: false
      };
      
      this.studentService.createStudent(newStudent).subscribe({
        next: () => {
          this.loadStudents();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear estudiante:', error);
          alert('Error al crear el estudiante');
        }
      });
    }
  }

  deleteStudent(student: Student) {
    if (confirm(`¿Estás seguro de que quieres eliminar al estudiante "${student.nombreCompleto}"?`)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error al eliminar estudiante:', error);
          alert('Error al eliminar el estudiante');
        }
      });
    }
  }

  toggleStudentStatus(student: Student) {
    const action = student.activo ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que quieres ${action} al estudiante "${student.nombreCompleto}"?`)) {
      const operation = student.activo 
        ? this.studentService.deactivateStudent(student.id)
        : this.studentService.activateStudent(student.id);
      
      operation.subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (error) => {
          console.error(`Error al ${action} estudiante:`, error);
          alert(`Error al ${action} el estudiante`);
        }
      });
    }
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