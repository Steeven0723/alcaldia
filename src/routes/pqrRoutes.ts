// src/routes/pqrRoutes.ts

import { Router } from "../../deps.ts";
import { createPQRSD } from "../controllers/pqrController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = new Router();

// Rutas del dashboard
router.post("/pqrsd", authMiddleware(["1","2"]), createPQRSD);


export default router;
