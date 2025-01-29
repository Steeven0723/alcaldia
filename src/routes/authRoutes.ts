// routes/authRoutes.ts
import { Router } from "../../deps.ts";
import { loginUser, logoutUser  } from "../controllers/authController.ts";
import { getDependencias } from "../controllers/dependenceController.ts";


const authRouter = new Router();


authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
export default authRouter;
