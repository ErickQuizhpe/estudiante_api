export interface FinancialInfo {
  id: number;
  pensionMensual: number;
  descuento: number;
  montoPendiente: number;
  ultimoPago: string;
  fechaVencimiento: string;
  alDia: boolean;
  becado: boolean;
  porcentajeBeca: number;
  observaciones: string;
  estudianteId: number;
  estudianteMatricula: string;
  estudianteNombre: string;
  montoAPagar: number;
  totalDescuento: number;
  diasVencimiento: number;
  
  // Campos calculados para compatibilidad con el código existente
  montoTotal?: number;
  montoPagado?: number;
  fechaUltimoPago?: string;
  tieneDescuento?: boolean;
  porcentajeDescuento?: number;
  esBecario?: boolean;
  enMora?: boolean;
  diasMora?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  activo?: boolean;
}

export interface FinancialStatistics {
  montoTotalPendiente: number;
  countEstudiantesEnMora: number;
  countEstudiantesBecados: number;
}
