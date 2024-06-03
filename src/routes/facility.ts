import { Router } from "express";
import { createBooking } from "../controllers/facility.controller";

const router = Router();

router.post("/facility/book", createBooking);

export default router;