import { Router } from "express";
import { sendMessage, getChats, getChatById, deleteChat } from "../controllers/chat.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/message", requireAuth, sendMessage);
router.get("/", requireAuth, getChats);
router.get("/:id", requireAuth, getChatById);
router.delete("/:id", requireAuth, deleteChat);

export default router;