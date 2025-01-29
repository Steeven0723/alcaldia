// // routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const userRoutes = new Router();

  // Ruta para servir el archivo HTML del user

const htmlRoutes = [
  { path: "/admin/user/index.html", filePath: "/admin/user/index.html" },
  { path: "/admin/user/create.html", filePath: "/admin/user/create.html" },
  { path: "/admin/user/listUsers.html", filePath: "/admin/user/listUsers.html" },
  { path: "/admin/user/edit.html", filePath: "/admin/user/edit.html" },

];

htmlRoutes.forEach(({ path, filePath }) => {
  userRoutes.get(path, async (ctx) => {
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




  export default userRoutes;