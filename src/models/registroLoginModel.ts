// models/registroLoginModel.ts
export interface RegistroLogin {
    _id?: { $oid: string };
    id_user: string;
    fecha: string;
    hora: string;
    text_trazabilidad?: string; // Inicialmente NULL
  }