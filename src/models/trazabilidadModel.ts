// models/trazabilidadModel.ts
export interface Trazabilidad {
    id_trazabilidad: number;
    id_registro: string;
    text: string; // Ejemplo: "Inicio de sesión", "Ingreso de documento"
    status: boolean; // true o false
  }