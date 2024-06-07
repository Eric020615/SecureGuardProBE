import { Router } from "express";
import { createNotice, getNotices, getNoticesByResident } from "../controllers/notice.controller";

const router = Router();

router.get("/notice", getNotices);
router.post("/notice/create-notice", createNotice);
router.get("/resident/notice", getNoticesByResident);

export default router;