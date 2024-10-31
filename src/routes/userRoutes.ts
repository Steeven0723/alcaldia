// routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { registerUser, loginUser,  } from "../controllers/userController.ts";
import dashboardRoutes from "./dashboardRoutes.ts";

const router = new Router();

// Rutas de autenticación de usuario
router.post("/register", registerUser);
router.post("/login", loginUser);

// Rutas del dashboard
router.use(dashboardRoutes.routes());
router.use(dashboardRoutes.allowedMethods());

export default router;
