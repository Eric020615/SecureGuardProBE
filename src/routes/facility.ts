import { Router } from "express";
import { createBooking, getBookingHistory } from "../controllers/facility.controller";
import { checkJWT } from "../middleware/security.middleware";

const router = Router();

router.get("/facility", checkJWT, getBookingHistory);
router.post("/facility/book", checkJWT, createBooking);

export default router;