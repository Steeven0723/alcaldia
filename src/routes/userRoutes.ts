// // routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { updateUser, updatepass, listUsers, registerInactivos, registerUser } from "../controllers/userController.ts";



const userRoutes = new Router();

userRoutes.post("/registerUser", registerUser);
userRoutes.get("/listUsers", listUsers); 
userRoutes.put('/updateUser/:id', updateUser);
userRoutes.put('/updatepass', updatepass);
userRoutes.post("/disable", registerInactivos); 


  // Ruta para servir el archivo HTML del user

const htmlRoutes = [
  { path: "/admin/user/create.html", filePath: "/admin/user/create.html" },
  { path: "/admin/user/editUsers.html", filePath: "/admin/user/editUsers.html" },
  { path: "/admin/user/updatepass.html", filePath: "/admin/user/updatepass.html" },

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