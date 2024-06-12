import { Router } from "express";
import { createNotice, deleteNotice, editNotice, getNoticeById, getNotices, getNoticesByResident } from "../controllers/notice.controller";

const router = Router();

router.get("/notice", getNotices);
router.get("/notice/id", getNoticeById);
router.put("/notice/update/:id", editNotice);
router.post("/notice/create-notice", createNotice);
router.delete("/notice/delete-notice/:id", deleteNotice);
router.get("/resident/notice", getNoticesByResident);

export default router;