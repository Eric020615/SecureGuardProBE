import { Router } from "express";
import { signUpAsResident, LogIn } from "../controllers/auth.controller";

const router = Router();

router.post("/log-in", LogIn);

router.post("/sign-up", signUpAsResident);

export default router;