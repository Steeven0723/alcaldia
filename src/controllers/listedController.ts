// //controllers/listedContoller.ts
import { Context } from "../../deps.ts";
import { Usuarios } from "../models/userModel.ts";
import { connectToPostgres } from "../config/db.ts";
import { _JWT_SECRET } from "../utils/jwtUtils.ts";

export const listUsersInactive = async (ctx: Context) => {
  const db = await connectToPostgres();

  try {
    const query = `
        SELECT 
          u.id_usuario,
          u.nombre,
          u.email,
          u.cedula,
          u.telefono,
          u.id_dependencia,
          d.nombre_dependencia,
          u.estado,
          i.fecha
      FROM usuarios u
      LEFT JOIN dependencias d ON u.id_dependencia = d.id_dependencia  
      LEFT JOIN inactivos i ON u.id_usuario = i.id_usuario 
      WHERE u.estado = FALSE  
      ORDER BY i.fecha ASC;
`;

    const result = await db.queryObject<Usuarios>(query);
    const users = result.rows;

    ctx.response.status = 200; // Código de éxito
    ctx.response.body = {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    ctx.response.status = 500; // Error interno del servidor
    ctx.response.body = {
      success: false,
      message: "Error al listar usuarios",
    };
  } finally {
    db.release();
  }
};

export const listOfficialsActive = async (ctx: Context) => {
  const db = await connectToPostgres();

  try {
    const query = `
        SELECT 
          u.id_usuario,
          u.nombre,
          u.email,
          u.cedula,
          u.telefono,
          u.id_dependencia,
          d.nombre_dependencia,
          u.estado,
          u.role 
      FROM usuarios u
      LEFT JOIN dependencias d ON u.id_dependencia = d.id_dependencia  
      WHERE u.estado = TRUE  
      AND u.role = 2  
      ORDER BY u.nombre ASC;  -- Puedes ordenar como desees
    `;

    const result = await db.queryObject<Usuarios>(query);
    const users = result.rows;

    ctx.response.status = 200; // Código de éxito
    ctx.response.body = {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    ctx.response.status = 500; // Error interno del servidor
    ctx.response.body = {
      success: false,
      message: "Error al listar usuarios activos",
    };
  } finally {
    db.release();
  }
};

