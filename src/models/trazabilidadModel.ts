// models/trazabilidadModel.ts
export interface Trazabilidad {
    _id?: { $oid: string };
    id_registro: string;
    text: string; // Ejemplo: "Inicio de sesión", "Ingreso de documento"
    status: boolean; // true o false
  }