import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import chatRoutes from "./routes/chat.routes"; 
import resourceRoutes from "./routes/resource.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/users", userRoutes);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("SkillPath AI Server is running");
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 