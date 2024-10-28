// routes/routes.ts
import { Router, verify } from "../../deps.ts";
import userRouter from "./userRoutes.ts"; // Importa las rutas de usuario

const router = new Router();

router.use(userRouter.routes());
router.use(userRouter.allowedMethods());

// Ruta para la página de inicio
router.get("/", async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo no encontrado" };
  }
});

// Ruta para el registro (register.html)
router.get("/register.html", async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "register.html",
    });
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo no encontrado" };
  }
});

// Ruta para el login (login.html)
router.get("/login.html", async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "login.html",
    });
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo no encontrado" };
  }
});

// Rutas para CSS y JS
router.get("/css/:file", async (ctx) => {
  const file = ctx.params.file;
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public/`,
      index: file,
    });
  } catch (error) {
    console.error("Error al enviar el archivo CSS:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo CSS no encontrado" };
  }
});

router.get("/js/:file", async (ctx) => {
  const file = ctx.params.file;
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public/`,
      index: file,
    });
  } catch (error) {
    console.error("Error al enviar el archivo JS:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo JS no encontrado" };
  }
});

// Rutas para el dashboard
// router.get("/dashboard.html", async (ctx) => {
//   const authHeader = ctx.request.headers.get("Authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     ctx.response.status = 401;
//     ctx.response.body = { message: "No autorizado" };
//     return;
//   }

//   const token = authHeader.split(" ")[1];
//   try {
//     const payload = await verify(token, _JWT_SECRET, "HS512");
//     console.log("Token verificado con éxito", payload);
//     ctx.response.body = await Deno.readTextFile("./public/dashboard.html");
//   } catch (error) {
//     console.error("Error al verificar el token:", error.message);
//     ctx.response.status = 401;
//     ctx.response.body = { message: "Token inválido" };
//   }
// });


// Puedes agregar más rutas aquí

export default router;
