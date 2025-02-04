// src/controllers/dependenceController.ts
import { Context } from "../../deps.ts";
import { connectToPostgres } from "../config/db.ts";
import { Dependencias } from "../models/dependenceModel.ts";


export const getDependence = async (ctx: Context) => {
  try {
    const db = await connectToPostgres();
    const result = await db.queryObject<Dependencias>("SELECT id_dependencia, nombre_dependencia FROM dependencias;");
    
    db.release();

    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { error: "No se encontraron dependencias" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = result.rows;
  } catch (error) {
    console.error("Error al obtener dependencias:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error al obtener dependencias" };
  }
};

export const listDependence = async (ctx: Context) => {
  const db = await connectToPostgres();

  try {
    // Consultar todos los dependencias en la base de datos
    const query = `
      SELECT id_dependencia, nombre_dependencia
      FROM dependencias
      ORDER BY id_dependencia ASC;
    `;

    // const query = `
    //   SELECT 
    //     u.id_dependencia,
    //     u.nombre_dependencia
    //   FROM dependencias u
    //   ORDER BY u.id_dependencia ASC;
    // `;

    const result = await db.queryObject<Dependencias>(query);
    const users = result.rows;

    ctx.response.status = 200; // Código de éxito
    ctx.response.body = {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error al listar dependencias:", error);
    ctx.response.status = 500; // Error interno del servidor
    ctx.response.body = {
      success: false,
      message: "Error al listar dependencias",
    };
  } finally {
    db.release();
  }
};

export const updateDependence = async (ctx: Context) => {
  const db = await connectToPostgres();
  const userId = ctx.params.id; // Obtener el ID del usuario a actualizar
  const { value } = await ctx.request.body();
  const userData = await value;

  try {
    const query = `
      UPDATE dependencias SET
        id_dependencia = $1,
        nombre_dependencia = $2
      WHERE id_dependencia = $3
      RETURNING *
    `;
    const result = await db.queryObject<Dependencias>(query, [
      userData.id_dependencia,
      userData.nombre_dependencia,
      userId
    ]);

    if (result.rows.length > 0) {
      ctx.response.body = { success: true, data: result.rows[0] };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { 
        success: false, 
        message: 'Dependencia no encontrado' };
    }
  } catch (error) {
    console.error('Error al actualizar dependencia:', error);
    ctx.response.status = 500;
    ctx.response.body = { success: false, message: 'Error al actualizar dependencia' };
  } finally {
    db.release();
  }
};