import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotaService } from '../../services/nota-service';
import { MateriaService } from '../../services/materia-service';
import { StudentService } from '../../services/student-service';
import { AuthService } from '../../services/auth-service';
import { Nota } from '../../models/Nota';
import { Materia } from '../../models/Materia';
import { Student } from '../../models/Student';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-notas',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    DialogModule,
    TableModule,
    InputNumberModule,
    CheckboxModule,
    TooltipModule
  ],
  templateUrl: './notas.html',
  styleUrl: './notas.css',
})
export class Notas implements OnInit, OnDestroy {
  notas: Nota[] = [];
  filteredNotas: Nota[] = [];
  materias: Materia[] = [];
  loading: boolean = true;
  
  // Filtros
  searchTerm: string = '';
  selectedMateria: number | null = null;
  selectedTipoEvaluacion: string = '';
  
  // Dialog
  showNewNotaDialog: boolean = false;
  selectedNota: Nota = this.getEmptyNota();
  
  // Opciones
  tiposEvaluacion: string[] = ['Examen', 'Quiz', 'Tarea', 'Proyecto', 'Participación', 'Laboratorio'];

  private userSubscription?: Subscription;
  currentUserId: string | null = null;
  currentStudentId: number | null = null;
  currentStudent: Student | null = null;

  constructor(
    private notaService: NotaService,
    private materiaService: MateriaService,
    private studentService: StudentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        console.log('🆔 Usuario logueado:', user);
        // Ir directo al método alternativo que funciona
        this.tryAlternativeStudentMethod();
      } else {
        this.tryLoadUserFromStorage();
      }
    });
  }

  private loadStudentData() {
    // Método eliminado - ya no necesario
    console.log('🔄 Usando método alternativo directamente...');
    this.tryAlternativeStudentMethod();
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
            this.loadData();
            return;
          }
        }
        
        // Si no encuentra coincidencia exacta, usar el primer estudiante
        if (students.length > 0) {
          console.warn('⚠️ No se encontró coincidencia exacta, usando primer estudiante');
          this.currentStudent = students[0];
          this.currentStudentId = students[0].id!;
          this.loadData();
        } else {
          this.useFallbackStudent();
        }
      },
      error: (error) => {
        console.error('❌ Error obteniendo estudiantes:', error);
        this.useFallbackStudent();
      }
    });
  }

  private tryLoadUserFromStorage() {
    console.log('💾 No hay usuario en AuthService, buscando en localStorage...');
    
    const possibleKeys = ['currentUser', 'auth_user', 'user', 'authUser'];
    let userData: string | null = null;
    
    for (const key of possibleKeys) {
      userData = localStorage.getItem(key);
      if (userData) {
        console.log(`✅ Datos en localStorage['${key}']:`, userData);
        break;
      }
    }
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserId = user.id || user.userId || user.user_id;
        console.log('📋 Usuario desde localStorage:', user);
      } catch (error) {
        console.error('❌ Error parsing localStorage:', error);
      }
    }
    
    // Independientemente de si encontró datos en localStorage, 
    // usar el método alternativo que funciona
    this.tryAlternativeStudentMethod();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadData() {
    if (!this.currentStudentId) {
      console.error('No se pudo obtener el ID del estudiante actual');
      this.loading = false;
      return;
    }

    this.loading = true;
    console.log('Cargando notas para el estudiante ID:', this.currentStudentId);
    
    this.notaService.getNotasByEstudiante(this.currentStudentId).subscribe({
      next: (notas) => {
        console.log('Notas recibidas:', notas);
        this.notas = notas.map(nota => ({
          ...nota,
          valor: nota.calificacion,
          activo: nota.activa,
          aprobada: nota.aprobado,
          reprobada: !nota.aprobado,
          fechaRegistro: nota.fechaEvaluacion
        }));
        this.filteredNotas = [...this.notas];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notas:', error);
        this.loading = false;
      }
    });

    this.materiaService.getAllMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
      },
      error: (error) => {
        console.error('Error loading materias:', error);
      }
    });
  }

  applyFilters() {
    this.filteredNotas = this.notas.filter(nota => {
      const matchSearch = !this.searchTerm || 
        nota.materiaNombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        nota.tipoEvaluacion?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchMateria = !this.selectedMateria || nota.materiaId === this.selectedMateria;
      const matchTipo = !this.selectedTipoEvaluacion || nota.tipoEvaluacion === this.selectedTipoEvaluacion;

      return matchSearch && matchMateria && matchTipo;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedMateria = null;
    this.selectedTipoEvaluacion = '';
    this.filteredNotas = [...this.notas];
  }

  editNota(nota: Nota) {
    this.selectedNota = { ...nota };
    this.showNewNotaDialog = true;
  }

  saveNota() {
    if (this.selectedNota?.id && this.selectedNota.id > 0) {
      this.notaService.updateNota(this.selectedNota.id, this.selectedNota).subscribe({
        next: () => {
          this.loadData();
          this.closeDialog();
          alert('Comentario guardado exitosamente');
        },
        error: (error) => {
          console.error('Error updating nota:', error);
          alert('Error al guardar comentario');
        }
      });
    }
  }

  closeDialog() {
    this.showNewNotaDialog = false;
    this.selectedNota = this.getEmptyNota();
  }

  getEmptyNota(): Nota {
    return {
      id: 0,
      calificacion: 0,
      valor: 0,
      notaMaxima: 20,
      porcentaje: 0,
      tipoEvaluacion: '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      fechaRegistro: new Date().toISOString().split('T')[0],
      observaciones: '',
      activa: true,
      activo: true,
      aprobado: false,
      aprobada: false,
      reprobada: false,
      estudianteId: 0,
      estudianteMatricula: '',
      estudianteNombre: '',
      materiaId: 0,
      materiaCodigo: '',
      materiaNombre: ''
    };
  }

  getMateriaNombre(materiaId: number): string {
    const materia = this.materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : 'Materia no encontrada';
  }

  getEstudianteNombre(estudianteId: number): string {
    if (this.currentStudent) {
      return `${this.currentStudent.firstName} ${this.currentStudent.lastName}`;
    }
    return 'Mi información';
  }

  // Método de fallback para cuando no se encuentra ningún estudiante
  private useFallbackStudent() {
    this.currentStudent = null;
    this.currentStudentId = null;
    this.notas = [];
    this.filteredNotas = [];
    this.loading = false;
    console.warn('⚠️ No se encontró ningún estudiante. Se ha limpiado la información.');
  }
}