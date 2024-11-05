// middlewares/authMiddleware.ts
import { Context } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { verifyJWT, _JWT_SECRET } from "../utils/jwtUtils.ts";

export function authMiddleware(allowedRoles: string[] = []) {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      // Verificar si ctx.request y ctx.request.headers existen
      if (!ctx.request || !ctx.request.headers) {
        throw new Error("La estructura de la solicitud no es válida");
      }

      const authorizationHeader = ctx.request.headers.get("Authorization");

      if (!authorizationHeader) {
        ctx.response.status = 401;
        ctx.response.body = { message: "No autorizado. Inicia sesión para acceder." };
        return;
      }
      
      const token = authorizationHeader.replace("Bearer ", "");
      
      const payload = await verifyJWT(token);
      if (!payload) {
        throw new Error("Token inválido");
      }

      ctx.state.user = payload;

      if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
        ctx.response.status = 403;
        ctx.response.body = { message: "No tienes permiso para acceder a este recurso." };
        return;
      }

      await next();
    } catch (error) {
      console.error("Error en el middleware de autenticación:", error);
      ctx.response.status = 401;
      ctx.response.body = { message: "Token inválido o expirado. Inicia sesión nuevamente." };
    }
  }
}