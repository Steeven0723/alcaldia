// routes/dependenceRoutes.ts
import { Router } from "../../deps.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const dependenceRoutes = new Router();

  // Ruta específica para administradores
  dependenceRoutes.get("/admin/dependence/index", authMiddleware(["1"]), (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      success: true,
      role: ctx.state.user.role,
      message: "Bienvenido, administrador",      
    };
  });

  // Ruta para servir el archivo HTML del dependence
  dependenceRoutes.get("/admin/dependence/index.html", async (ctx) => {
    try {
      await ctx.send({
        root: `${Deno.cwd()}/public`,
        index: "/admin/dependence/index.html",
      });
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      ctx.response.status = 404;
      ctx.response.body = { message: "Archivo no encontrado" };
    }
  });


  export default dependenceRoutes;