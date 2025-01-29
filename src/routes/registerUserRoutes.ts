// // routes/registerUserRoutes.ts
// import { Router } from "../../deps.ts";
// import { authMiddleware } from "../middlewares/authMiddleware.ts";

// const registerUserRoutes = new Router();

//   // Ruta específica para administradores
//   registerUserRoutes.get("/admin/user/index", authMiddleware(["1"]), (ctx) => {
//     ctx.response.headers.set("Content-Type", "application/json");
//     ctx.response.body = {
//       success: true,
//       role: ctx.state.user.role,
//       message: "Bienvenido, administrador",      
//     };
//   });

//   // Ruta para servir el archivo HTML del dependence
//   registerUserRoutes.get("/admin/user/index.html", async (ctx) => {
//     try {
//       await ctx.send({
//         root: `${Deno.cwd()}/public`,
//         index: "/admin/user/index.html",
//       });
//     } catch (error) {
//       console.error("Error al enviar el archivo:", error);
//       ctx.response.status = 404;
//       ctx.response.body = { message: "Archivo no encontrado" };
//     }
//   });

//   registerUserRoutes.get("/admin/user/create.html", async (ctx) => {
//     try {
//       await ctx.send({
//         root: `${Deno.cwd()}/public`,
//         index: "/admin/user/create.html",
//       });
//     } catch (error) {
//       console.error("Error al enviar el archivo:", error);
//       ctx.response.status = 404;
//       ctx.response.body = { message: "Archivo no encontrado" };
//     }
//   });

//   registerUserRoutes.get("/admin/user/listUsers.html", async (ctx) => {
//     try {
//       await ctx.send({
//         root: `${Deno.cwd()}/public`,
//         index: "/admin/user/listUsers.html",
//       });
//     } catch (error) {
//       console.error("Error al enviar el archivo:", error);
//       ctx.response.status = 404;
//       ctx.response.body = { message: "Archivo no encontrado" };
//     }
//   });

//   export default registerUserRoutes;