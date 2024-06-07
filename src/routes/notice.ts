import { Router } from "express";
import { createNotice, getNotices } from "../controllers/notice.controller";

const router = Router();

router.get("/notice", getNotices);
router.post("/notice/create-notice", createNotice);

export default router;