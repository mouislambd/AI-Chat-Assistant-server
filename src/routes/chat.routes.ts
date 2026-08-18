import { Router } from "express";
import { sendMessage, getChats, getChatById, deleteChat } from "../controllers/chat.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/message", (req, res, next) => {
    console.log("Request received at /api/chat/message");
    next();
}, requireAuth, sendMessage);
router.get("/", requireAuth, getChats);
router.get("/:id", requireAuth, getChatById);
router.delete("/:id", requireAuth, deleteChat);

export default router;