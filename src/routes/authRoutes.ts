// routes/authRoutes.ts
import { Router } from "../../deps.ts";
import { loginUser, logoutUser  } from "../controllers/authController.ts";

const authRouter = new Router();


authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
export default authRouter;
