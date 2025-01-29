// routes/dashboardRoutes.ts
import { Router } from "../../deps.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const dashboardRouter = new Router();

// Ruta para la API de dashboard con autenticación para ambos roles
// dashboardRouter.get("/dashboard", authMiddleware(["1", "2", "3"]), (ctx) => {
//     ctx.response.headers.set("Content-Type", "application/json");
//     ctx.response.body = {
//       success: true,
//       role: ctx.state.users.role,
//     };
//   });


  // dashboardRouter.get("/official/listpqrs", authMiddleware(["2"]), (ctx) => {
  //   ctx.response.headers.set("Content-Type", "application/json");
  //   ctx.response.body = {
  //     success: true,
  //     message: "Bienvenido, funcionario",
  //     role: ctx.state.user.role,
  //   };
  // });

  // dashboardRouter.get("/official/listpqrs.html", async (ctx) => {
  //   try {
  //     await ctx.send({
  //       root: `${Deno.cwd()}/public`,
  //       index: "/official/listpqrs.html",
  //     });
  //   } catch (error) {
  //     console.error("Error al enviar el archivo:", error);
  //     ctx.response.status = 404;
  //     ctx.response.body = { message: "Archivo no encontrado" };
  //   }
  // });

const userRoute = [
  {
    path: "/admin",
    roles: ["1","2"],
    response: { message: "Bienvenido, administrador" },
  },
  {
    path: "/official",
    roles: ["2"],
    response: { message: "Bienvenido, funcionario" },
  },
  {
    path: "/reception",
    roles: ["3"],
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