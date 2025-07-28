export interface Nota {
  id: number;
  calificacion: number;
  notaMaxima: number;
  porcentaje: number;
  tipoEvaluacion: string;
  fechaEvaluacion: string;
  observaciones: string;
  activa: boolean;
  aprobado: boolean;
  estudianteId: number;
  estudianteMatricula: string;
  estudianteNombre: string;
  materiaId: number;
  materiaCodigo: string;
  materiaNombre: string;
  
  // Campos para compatibilidad con código existente - siempre definidos
  valor: number; // Mapear a calificacion
  fechaRegistro: string;
  activo: boolean; // Mapear a activa
  aprobada: boolean; // Mapear a aprobado
  reprobada: boolean;
}

export interface PromedioMateria {
  materiaId: number;
  materiaNombre: string;
  promedio: number;
  creditos: number;
  aprobada: boolean;
}

export interface PromedioEstudiante {
  estudianteId: number;
  estudianteNombre: string;
  promedioGeneral: number;
  creditosAprobados: number;
  creditosTotal: number;
  materias: PromedioMateria[];
}
