// src/controllers/pqrController.ts

import { connectToMongoDB } from "../config/db.ts";
import { PQRSD } from "../models/pqrModel.ts";
import { Context } from "../../deps.ts";
import {
  isNumber,
  isString,
  minLength,
  required,
  validate,
} from "../../deps.ts";

// Definir las reglas de validación para los campos de PQRSD
const pqrValidationRules = {
  tipo: [required, isString, minLength(3)],
  dependenciaDestino: [required, isString],
  prioridad: [required, isString],
  asunto: [required, isString, minLength(5)],
  medio: [required, isString],
  remitente: [required, isString],
  tramite: [required, isString],
  diasHabiles: [required, isNumber],
};

// Controlador para crear una nueva PQRSD
export const createPQRSD = async (ctx: Context) => {
  const db = await connectToMongoDB();
  const pqsrdCollection = db.collection<PQRSD>("pqrsd");

  const { value } = await ctx.request.body(); // 'value' contiene el cuerpo de la solicitud en formato JSON
  const pqrsdData = await value;

  console.log(pqrsdData);
  try {
    // Validar los datos de entrada
    const [passes, errors] = await validate(
      {
        tipo: pqrsdData.tipo,
        dependenciaDestino: pqrsdData.dependenciaDestino,
        prioridad: pqrsdData.prioridad,
        asunto: pqrsdData.asunto,
        medio: pqrsdData.medio,
        remitente: pqrsdData.remitente,
        tramite: pqrsdData.tramite,
        diasHabiles: pqrsdData.diasHabiles,
      },
      pqrValidationRules,
    );

    if (!passes) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Error de validación", errors };
      return;
    }

    // Calcular la fecha límite sumando los días hábiles
    const fechaRegistro = new Date();
    const fechaLimite = new Date(fechaRegistro);
    fechaLimite.setDate(fechaRegistro.getDate() + pqrsdData.diasHabiles);

    const newPQRSD: PQRSD = {
      tipo: pqrsdData.tipo,
      dependenciaDestino: pqrsdData.dependenciaDestino,
      prioridad: pqrsdData.prioridad,
      fechaRegistro,
      fechaLimite,
      estado: "Por Resolver",
      asunto: pqrsdData.asunto,
      medio: pqrsdData.medio,
      remitente: pqrsdData.remitente,
      tramite: pqrsdData.tramite,
    };

    // Insertar el nuevo documento en la colección de PQRSDs
    const result = await pqsrdCollection.insertOne(newPQRSD);
    console.log("PQRSD inserted:", result);

    ctx.response.status = 201;
    ctx.response.body = {
      success: true,
      message: "PQRSD registrada exitosamente",
      id: result.id,
    };
  } catch (error) {
    console.error("Error al registrar PQRSD:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al registrar PQRSD" };
  }
};
