// routes/routes.ts
import { Router } from "../../deps.ts";
import userRouter from "./userRoutes.ts"; // Importa las rutas de usuario
import pqrRoutes from "./pqrRoutes.ts";

const router = new Router();

router.use(userRouter.routes());
router.use(userRouter.allowedMethods());
router.use(pqrRoutes.routes());



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


// // Ruta para el registro (register.html)
// router.get("/auth/register.html", async (ctx) => {
//   try {
//     await ctx.send({
//       root: `${Deno.cwd()}/public`,
//       index: "register.html",
//     });
//   } catch (error) {
//     console.error("Error al enviar el archivo:", error);
//     ctx.response.status = 404;
//     ctx.response.body = { message: "Archivo no encontrado" };
//   }
// });

// Ruta para el registro del administrador
router.get("/auth/register.html", async (ctx) => {
  const query = ctx.request.url.searchParams;
  const accessCode = query.get("code"); // Obtén el parámetro "code" de la URL

  // Define tu código de acceso
  const secretCode = "ADMIN2024";

  if (accessCode === secretCode) {
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
  } else {
    // Redirige al login
    ctx.response.status = 302; // Código de redirección
    ctx.response.headers.set("Location", "/auth/login.html");
  }
});



// Ruta para el login (login.html)
router.get("/auth/login.html", async (ctx) => {
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

router.get("/img/:file", async (ctx) => {
  const file = ctx.params.file;
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public/`,
      index: file,
    });
  } catch (error) {
    console.error("Error al enviar el archivo IMG:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo IMG no encontrado" };
  }
});


// Puedes agregar más rutas aquí

export default router;
