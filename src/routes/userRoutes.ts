// routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { registerUser, loginUser,  } from "../controllers/userController.ts";

const router = new Router();
router.post("/register", registerUser);
router.post("/login", loginUser);


export default router;
