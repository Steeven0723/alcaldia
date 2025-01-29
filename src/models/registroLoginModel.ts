// models/registroLoginModel.ts
export interface RegistroLogin {
    id_registro: number;
    id_usuario: string;
    fecha: string;
    hora: string;
    text_trazabilidad?: string; // Inicialmente NULL
  }