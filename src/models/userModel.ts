// models/userModel.ts
import { ObjectId } from "../../deps.ts";

export interface User {
  _id?: ObjectId; // Identificador único
  name: string;
  email: string;
  password: string; // Aquí guardaremos la contraseña cifrada
  totp_secret : string;
}
