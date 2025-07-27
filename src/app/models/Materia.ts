export interface Materia {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  semestre: number;
  carrera: string;
  activa: boolean;  // Cambiado de 'activo' a 'activa' para coincidir con el API
  estado?: string; // ACTIVA, INACTIVA, EN_PROCESO
  modalidad?: string; // PRESENCIAL, VIRTUAL, MIXTA
  tipoMateria?: string; // OBLIGATORIA, OPTATIVA, PRACTICA
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface MateriaCarrera {
  carrera: string;
  materias: Materia[];
}
