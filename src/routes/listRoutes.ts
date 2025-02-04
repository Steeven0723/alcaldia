// // routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { listUsersInactive, listOfficialsActive } from "../controllers/listedController.ts";



const listRoutes = new Router();

listRoutes.get("/listUsersInactive", listUsersInactive); 
listRoutes.get("/listOfficialsActive", listOfficialsActive);


  // Ruta para servir el archivo HTML del user

const htmlRoutes = [
  { path: "/admin/listed/listUsers.html", filePath: "/admin/listed/listUsers.html" },
  { path: "/admin/listed/listUsersDependence.html", filePath: "/admin/listed/listUsersDependence.html" },
  { path: "/admin/listed/listUsersInactive.html", filePath: "/admin/listed/listUsersInactive.html" },
  { path: "/admin/listed/listOfficialsActive.html", filePath: "/admin/listed/listOfficialsActive.html" },


];

htmlRoutes.forEach(({ path, filePath }) => {
  listRoutes.get(path, async (ctx) => {
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




  export default listRoutes;