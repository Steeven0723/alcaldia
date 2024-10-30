// middlewares/authMiddleware.ts
import { verifyJWT, _JWT_SECRET } from "../utils/jwtUtils.ts";

// Middleware para verificar el token JWT
export async function authMiddleware(ctx: any, next: any) {
    const authorizationHeader = ctx.request.headers.get("Authorization");

    if (!authorizationHeader) {
        ctx.response.status = 401;
        ctx.response.body = { message: "No autorizado. Inicia sesión para acceder." };
        return;
    }
    
    const token = authorizationHeader.replace("Bearer ", "");
    try {
        const payload = await verifyJWT(token, _JWT_SECRET, "HS256");
        ctx.state.user = payload;
        await next();
    } catch (error) {
        console.error("Error al verificar el token:", error);
        ctx.response.status = 401;
        ctx.response.body = { message: "Token inválido o expirado. Inicia sesión nuevamente." };
    }
    
  }
  
