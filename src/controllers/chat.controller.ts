import { Request, Response } from "express";
import Chat from "../models/chat.model";
import { groq } from "../lib/groq";

const SYSTEM_PROMPT = `You are SkillPath AI, a friendly career and study mentor for students. 
Help with study roadmaps, career advice, resource suggestions, and general learning questions. 
Keep answers clear, practical, and encouraging.`;

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { chatId, message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        let chat = chatId
            ? await Chat.findOne({ _id: chatId, userId: user.id })
            : null;

        if (!chat) {
            chat = new Chat({
                userId: user.id,
                title: message.slice(0, 40),
                messages: [],
            });
        }

        chat.messages.push({
            role: "user",
            content: message,
            createdAt: new Date(),
        });

        const history = chat.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        });

        const aiReply = completion.choices[0]?.message?.content || "";

        chat.messages.push({
            role: "assistant",
            content: aiReply,
            createdAt: new Date(),
        });

        await chat.save();

        res.status(200).json({ chatId: chat._id, reply: aiReply, chat });
    } catch (error) {
        console.error("ERROR in sendMessage:", error);
        res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
    }
};

export const getChats = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const chats = await Chat.find({ userId: user.id })
            .select("title createdAt updatedAt")
            .sort({ updatedAt: -1 });

        res.status(200).json({ chats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getChatById = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { id } = req.params;

        const chat = await Chat.findOne({ _id: id, userId: user.id });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({ chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const deleteChat = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { id } = req.params;

        const result = await Chat.deleteOne({ _id: id, userId: user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Chat not found or not authorized" });
        }

        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
