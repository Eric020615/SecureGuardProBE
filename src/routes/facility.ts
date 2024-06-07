import { Router } from "express";
import { createBooking, createBookingByAdmin, getBookingHistory, getBookingHistoryByAdmin } from "../controllers/facility.controller";
import { checkJWT } from "../middleware/security.middleware";

const router = Router();

router.get("/facility", checkJWT, getBookingHistory);
router.get("/facility/admin", getBookingHistoryByAdmin);
router.post("/facility/book", checkJWT, createBooking);
router.post("/facility/book/admin", createBookingByAdmin);

export default router;