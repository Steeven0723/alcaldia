// src/models/pqrModel.ts

import { ObjectId } from "../../deps.ts";

export interface PQRSD {
  _id?: ObjectId;
  tipo: string; // Petición, Queja, Reclamo, etc.
  dependenciaDestino: string;
  prioridad: string; // Bajo, Medio, Alto
  fechaRegistro: Date;
  fechaLimite: Date;
  fechaResolucion?: Date;
  estado: string; // Por Resolver, En Proceso, Resuelto, Finalizado
  asunto: string;
  medio: string; // Correo, Físico
  observacion?: string;
  remitente: string;
  tramite: string;
}


