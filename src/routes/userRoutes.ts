// routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { registerUser, loginUser, logoutUser  } from "../controllers/userController.ts";
import dashboardRoutes from "./dashboardRoutes.ts";
import dependenceRoutes from "./dependenceRoutes.ts";

const router = new Router();

// Rutas de autenticación de usuario
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Rutas del dashboard
router.use(dashboardRoutes.routes());
router.use(dashboardRoutes.allowedMethods());

router.use(dependenceRoutes.routes())
router.use(dependenceRoutes.allowedMethods());

export default router;
