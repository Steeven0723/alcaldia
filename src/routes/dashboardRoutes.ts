// routes/dashboardRoutes.ts
import { Router } from "../../deps.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const dashboardRouter = new Router();


const userRoute = [
  {
    path: "/admin",
    roles: ["Administrador"],
    response: { message: "Bienvenido, administrador" },
  },
  {
    path: "/official",
    roles: ["Funcionario"],
    response: { message: "Bienvenido, funcionario" },
  },
  {
    path: "/reception",
    roles: ["Recepcionista"],
    response: { message: "Bienvenido, recepcionista" },
  },
];

// Agregar rutas de la API
userRoute.forEach(({ path, roles, response }) => {
  dashboardRouter.get(path, authMiddleware(roles), (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      success: true,
      role: ctx.state.user.role,
      ...response,
    };
  });
});

  // Ruta para servir el archivo HTML de los Usuarios
const htmlRoutes = [
  { path: "/dashboard.html", filePath: "/dashboard.html" },
  { path: "/admin/dashboard.html", filePath: "/admin/dashboard.html" },
  { path: "/admin/sidebar.html", filePath: "/admin/sidebar.html" },
  { path: "/official/dashboard.html", filePath: "/official/dashboard.html" },
  { path: "/reception/dashboard.html", filePath: "/reception/dashboard.html" },
];

htmlRoutes.forEach(({ path, filePath }) => {
  dashboardRouter.get(path, async (ctx) => {
    try {
      await ctx.send({
        root: `${Deno.cwd()}/public`,
        index: filePath,
      });
    } catch (error) {
      console.error(`Error al enviar el archivo ${filePath}:`, error);
      ctx.response.status = 404;
      ctx.response.body = { message: "Archivo no encontrado" };
    }
  });
});
export default dashboardRouter;