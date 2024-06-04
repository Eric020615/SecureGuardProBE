import { Router } from "express";
import { createBooking } from "../controllers/facility.controller";
import { checkJWT } from "../middleware/security.middleware";

const router = Router();

router.post("/facility/book", checkJWT, createBooking);

export default router;