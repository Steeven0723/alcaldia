// src/routes/dependenceRoutes.ts
import { Router } from "../../deps.ts";
import { getDependence, listDependence, updateDependence } from "../controllers/dependenceController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";



const dependenceRoutes = new Router();

dependenceRoutes.get("/dependencias", getDependence);
dependenceRoutes.get("/listDependence", listDependence);
dependenceRoutes.put("/updateDependence/:id", updateDependence);

  // Ruta específica para administradores
  // dependenceRoutes.get("/admin/dependence/index", authMiddleware(["1"]), (ctx) => {
  //   ctx.response.headers.set("Content-Type", "application/json");
  //   ctx.response.body = {
  //     success: true,
  //     role: ctx.state.user.role,
  //     message: "Bienvenido, administrador",      
  //   };
  // });



    // Ruta para servir el archivo HTML del dependence
  const htmlRoutes = [
    { path: "/admin/dependence/index.html", filePath: "/admin/dependence/index.html" },
  ];
  
  htmlRoutes.forEach(({ path, filePath }) => {
    dependenceRoutes.get(path, async (ctx) => {
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

  export default dependenceRoutes;