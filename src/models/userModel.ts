// models/userModel.ts
export interface Usuarios {
  id_usuario: number;      // ID generado automáticamente
  nombre: string;          // Nombre del usuario
  email: string;           // Correo electrónico único
  password: string;        // Contraseña cifrada
  totp_secret: string;     // Secreto TOTP
  cedula?: string;         // Cédula del usuario (opcional)
  telefono?: string;       // Teléfono del usuario (opcional)
  id_dependencia?: number; // ID de la dependencia (opcional)
  role: string;            // Rol del usuario
  estado: boolean;         // Estado del usuario (activo o inactivo)
  created_at?: string;     // Fecha de creación (opcional)
}
