// routes/dashboardRoutes.ts
import { Router } from "../../deps.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const dashboardRouter = new Router();

// Ruta para la API de dashboard con autenticación
dashboardRouter.get("/dashboard", authMiddleware, (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
        success: true,
    };
});

// Ruta para servir el archivo HTML del dashboard
dashboardRouter.get("/dashboard.html", async (ctx) => {
    try {
        await ctx.send({
            root: `${Deno.cwd()}/public`,
            index: "dashboard.html",
        });
    } catch (error) {
        console.error("Error al enviar el archivo:", error);
        ctx.response.status = 404;
        ctx.response.body = { message: "Archivo no encontrado" };
    }
});

export default dashboardRouter;
