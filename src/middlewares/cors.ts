// middlewares/cors.ts
import { Context, Next } from "../../deps.ts";

export const cors = async (ctx: Context, next: Next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*"); // Permitir solicitudes de cualquier origen
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Métodos permitidos
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Encabezados permitidos

    // Si la solicitud es de tipo OPTIONS, responder con No Content (204)
    if (ctx.request.method === "OPTIONS") {
        ctx.response.status = 204; // No Content
        return;
    }

    await next(); // Pasar al siguiente middleware o ruta
};
