// routes/dashboardRoutes.ts
import { Router } from "../../deps.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const dashboardRouter = new Router();

// Ruta para la API de dashboard con autenticación para ambos roles
dashboardRouter.get("/dashboard", authMiddleware(["1", "2", "3"]), (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      success: true,
      role: ctx.state.user.role,
    };
  });

  // Ruta específica para administradores
  dashboardRouter.get("/admin/dashboard", authMiddleware(["1"]), (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      success: true,
      role: ctx.state.user.role,
      message: "Bienvenido, administrador",      
    };
  });

  // Ruta específica para funcionarios
  dashboardRouter.get("/official/dashboard", authMiddleware(["2"]), (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      success: true,
      message: "Bienvenido, funcionario",
      role: ctx.state.user.role,
    };
  });

  dashboardRouter.get("/official/listpqrs", authMiddleware(["2"]), (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      success: true,
      message: "Bienvenido, funcionario",
      role: ctx.state.user.role,
    };
  });


    // Ruta específica para recepcionista
  dashboardRouter.get("/reception/dashboard", authMiddleware(["3"]), (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      success: true,
      message: "Bienvenido, funcionario",
      role: ctx.state.user.role,
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

dashboardRouter.get("/admin/dashboard.html", async (ctx) => {
    try {
      await ctx.send({
        root: `${Deno.cwd()}/public`,
        index: "/admin/dashboard.html",
      });
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      ctx.response.status = 404;
      ctx.response.body = { message: "Archivo no encontrado" };
    }
  });
  
  dashboardRouter.get("/official/dashboard.html", async (ctx) => {
    try {
      await ctx.send({
        root: `${Deno.cwd()}/public`,
        index: "/official/dashboard.html",
      });
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      ctx.response.status = 404;
      ctx.response.body = { message: "Archivo no encontrado" };
    }
  });

  dashboardRouter.get("/official/listpqrs.html", async (ctx) => {
    try {
      await ctx.send({
        root: `${Deno.cwd()}/public`,
        index: "/official/listpqrs.html",
      });
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      ctx.response.status = 404;
      ctx.response.body = { message: "Archivo no encontrado" };
    }
  });

  dashboardRouter.get("/reception/dashboard.html", async (ctx) => {
    try {
      await ctx.send({
        root: `${Deno.cwd()}/public`,
        index: "/reception/dashboard.html",
      });
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      ctx.response.status = 404;
      ctx.response.body = { message: "Archivo no encontrado" };
    }
  });


export default dashboardRouter;