import { Router } from "express";
import { signUpAsResident, LogIn, checkAuth } from "../controllers/auth.controller";
import { checkJWT } from "../middleware/security.middleware";

const router = Router();

router.post("/log-in", LogIn);
router.post("/sign-up", signUpAsResident);
router.post("/check-auth", checkJWT, checkAuth);

export default router;