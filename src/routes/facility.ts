import { Router } from "express";
import { cancelBooking, createBooking, createBookingByAdmin, getBookingHistory, getBookingHistoryByAdmin } from "../controllers/facility.controller";
import { checkJWT } from "../middleware/security.middleware";

const router = Router();

router.get("/facility", checkJWT, getBookingHistory);
router.get("/facility/admin", getBookingHistoryByAdmin);
router.post("/facility/book", checkJWT, createBooking);
router.post("/facility/book/admin", createBookingByAdmin);
router.put("/facility/cancel", cancelBooking);

export default router;