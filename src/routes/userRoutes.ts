// routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { registerUser, loginUser,  } from "../controllers/userController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts"; // Middleware de autenticación


const router = new Router();
router.post("/register", registerUser);
router.post("/login", loginUser);

// Ruta protegida del dashboard
router.get("/dashboard.html", authMiddleware, (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = "Bienvenido al Dashboard"; // O el contenido JSON del dashboard
});

export default router;
