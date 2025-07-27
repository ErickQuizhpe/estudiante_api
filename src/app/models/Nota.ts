export interface Nota {
  id: number;
  estudianteId: number;
  materiaId: number;
  valor: number;
  tipoEvaluacion: string;
  fechaEvaluacion: string;
  fechaRegistro: string;
  observaciones: string;
  aprobada: boolean;
  reprobada: boolean;
  activo: boolean;
  // Información adicional que puede venir del backend
  estudianteNombre?: string;
  materiaNombre?: string;
  materiaCreditos?: number;
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
