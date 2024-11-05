// models/userModel.ts
import { ObjectId } from "../../deps.ts";

// export enum UserRole {
//   ADMIN = 1,
//   OFFICIAL = 2,
//   RECEPTION = 3,
// }

export interface User {
  _id?: ObjectId; // Identificador único
  name: string;
  email: string;
  password: string; // Aquí guardaremos la contraseña cifrada
  totp_secret : string;
  role: string;
}
