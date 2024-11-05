import type { Context } from "../../deps.ts";
import { UserRole } from "../models/userModel.ts";

export const roleMiddleware = (allowedRoles: UserRole[]) => {
    return async (ctx: Context, next: () => Promise<void>) => {
        const user = ctx.state.user;

        // Verificar si el usuario está autenticado
        if (!user) {
            ctx.response.status = 403; // Prohibido
            ctx.response.body = { message: "Acceso denegado. No has iniciado sesión." };
            return;
        }

        // Verificar si el rol del usuario está en los roles permitidos
        if (!allowedRoles.includes(user.role)) {
            ctx.response.status = 403; // Prohibido
            ctx.response.body = { message: "Acceso denegado. Usuario o rol no permitido." };
            return;
        }

        // Si el rol es permitido, continúa
        await next();
    };
};

export default roleMiddleware;
