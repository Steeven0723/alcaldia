// routes/routes.ts
import { Router, Context  } from "../../deps.ts";
// import userRouter from "./userRoutes.ts"; // Importa las rutas de usuario
import authRoutes from "./authRoutes.ts"; 
import { listUsers, registerUser, updateUser} from "../controllers/userController.ts";
import dashboardRouter from "./dashboardRoutes.ts";
import dependenceRoutes from "./dependenceRoutes.ts";
import UserRoutes from "./userRoutes.ts";
import { getDependencias, listDependence, updateDependence } from "../controllers/dependenceController.ts";

const router = new Router();

// router.use(userRouter.routes());
// router.use(userRouter.allowedMethods());
router.use(authRoutes.routes());
router.use(authRoutes.allowedMethods());



// Rutas
router.post("/registerUser", registerUser);;
router.get("/listUsers", listUsers); // Endpoint para listar usuarios
router.put('/updateUser/:id', updateUser);
router.get("/dependencias", getDependencias);
router.get("/listDependence", listDependence);
router.put("/updateDependence/:id", updateDependence);




// Rutas del dashboard
router.use(dashboardRouter.routes());
router.use(dashboardRouter.allowedMethods());

router.use(dependenceRoutes.routes())
router.use(dependenceRoutes.allowedMethods());

router.use(UserRoutes.routes())
router.use(UserRoutes.allowedMethods());



// Ruta para la página de inicio
router.get("/", async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "auth/login.html",
    });
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo no encontrado" };
  }
});

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

// Rutas para CSS, JS e IMG
const allowedExtensions = ["css", "js", "img"];

router.get("/:extension/:file", async (ctx) => {
  const { extension, file } = ctx.params;

  if (!allowedExtensions.includes(extension)) {
    ctx.response.status = 404;
    ctx.response.body = { message: `Extensión no permitida: ${extension}` };
    return; 
  }

  try {
    await ctx.send({
      root: `${Deno.cwd()}/public/`,
      index: file,
    });
  } catch (error) {
    console.error(`Error al enviar el archivo ${extension.toUpperCase()}:`, error);
    ctx.response.status = 404;
    ctx.response.body = { message: `Archivo ${extension.toUpperCase()} no encontrado` };
  }
});

// Puedes agregar más rutas aquí

export default router;
