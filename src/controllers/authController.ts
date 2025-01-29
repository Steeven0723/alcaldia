// //controllers/userController.ts
import { bcrypt, Context, getNumericDate } from "../../deps.ts";
import { Usuarios } from "../models/userModel.ts";
import { connectToPostgres } from "../config/db.ts";
import { _JWT_SECRET, createJWT } from "../utils/jwtUtils.ts";
import { verifyTOTP } from "../utils/totpUtil.ts";

import { RegistroLogin } from "../models/registroLoginModel.ts";
import { Trazabilidad } from "../models/trazabilidadModel.ts";

export const loginUser = async (ctx: Context) => {
    try {
      const db = await connectToPostgres();
      const { email, password, totpCode } = await ctx.request.body().value;
  
      // Buscar usuario por email
      const userQuery = `SELECT * FROM usuarios WHERE email = $1`;
      const userResult = await db.queryObject<Usuarios>(userQuery, [email]);
  
      if (userResult.rows.length === 0) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Usuario no encontrado" };
        return;
      }
      const user = userResult.rows[0];
  
      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Contraseña incorrecta" };
        return;
      }
  
      // Verificar código TOTP
      if (!(await verifyTOTP(user.totp_secret, totpCode))) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Código TOTP inválido" };
        return;
      }
  
      // Crear JWT
      const token = await createJWT({
        id_usuario: user.id_usuario,
        email: user.email,
        role: user.role,
        exp: getNumericDate(60 * 60),
      });
  
      // Registrar inicio de sesión
      const fecha = new Date().toISOString().split("T")[0];
      const hora = new Date().toLocaleTimeString("es-ES");
  
      // Posible error 
      const registroLoginQuery = `
        INSERT INTO registro_login (id_usuario, fecha, hora, text_trazabilidad)
        VALUES ($1, $2, $3, $4) RETURNING id_registro;
      `;
  
      const registroResult = await db.queryObject<RegistroLogin>(registroLoginQuery, [
        user.id_usuario,
        fecha,
        hora,
        null,
      ]);
  
      const idRegistro = registroResult.rows[0].id_registro;
  
      // Registrar trazabilidad inicial
      const trazabilidadQuery = `
        INSERT INTO trazabilidad (id_registro, text, status)
        VALUES ($1, $2, $3);
      `;
  
      await db.queryObject<Trazabilidad>(trazabilidadQuery, [
        idRegistro,
        "Inicio de sesión",
        true,
      ]);
  
      ctx.response.status = 200;
      ctx.response.body = {
        message: "Inicio de sesión exitoso",
        token,
        role: user.role,
        id_registro: idRegistro,
        nombre: user.nombre,
      };
  
      ctx.response.headers.set("Authorization", `Bearer ${token}`);
    } catch (error) {
      console.error("Error en loginUser:", error);
      ctx.response.status = 500;
      ctx.response.body = { message: "Error interno del servidor" };
    }
  };

export const logoutUser = async (ctx: Context) => {
  try {
    const db = await connectToPostgres();
    const { id_registro } = await ctx.request.body().value;

    if (!id_registro) {
      ctx.response.status = 400;
      ctx.response.body = { message: "ID de registro no proporcionado" };
      return;
    }

    // Actualizar registro_login con texto de trazabilidad
    const updateLoginQuery = `
      UPDATE registro_login
      SET text_trazabilidad = (SELECT text FROM trazabilidad WHERE id_registro = $1 AND status = true LIMIT 1)
      WHERE id_registro = $1;
    `; // posible error

    await db.queryObject(updateLoginQuery, [id_registro]);

    // Actualizar trazabilidad
    const updateTrazabilidadQuery = `
      UPDATE trazabilidad
      SET text = 'null', status = false
      WHERE id_registro = $1 AND status = true;
    `;

    await db.queryObject(updateTrazabilidadQuery, [id_registro]);

    ctx.response.status = 200;
    ctx.response.body = { message: "Cierre de sesión exitoso" };
  } catch (error) {
    console.error("Error en logoutUser:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno del servidor" };
  }
};

export const updateTrazabilidad = async (ctx: Context) => {
  try {
    const db = await connectToPostgres();
    const { id_registro, pagina } = await ctx.request.body().value;

    const trazabilidadQuery = `SELECT * FROM trazabilidad WHERE id_registro = $1`;
    const trazabilidadResult = await db.queryObject<Trazabilidad>(trazabilidadQuery, [id_registro]);

    if (trazabilidadResult.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Registro de trazabilidad no encontrado" };
      return;
    }

    const trazabilidad = trazabilidadResult.rows[0];
    const newText = `${trazabilidad.text}, ${pagina}`;

    const updateTrazabilidadQuery = `
      UPDATE trazabilidad
      SET text = $1
      WHERE id_registro = $2;
    `;

    await db.queryObject(updateTrazabilidadQuery, [newText, id_registro]);

    ctx.response.status = 200;
    ctx.response.body = { message: "Trazabilidad actualizada" };
  } catch (error) {
    console.error("Error en updateTrazabilidad:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno del servidor" };
  }
};
