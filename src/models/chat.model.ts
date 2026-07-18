import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

export interface IChat extends Document {
    userId: string;
    title: string;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const chatSchema = new Schema<IChat>(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, default: "New Chat" },
        messages: [messageSchema],
    },
    { timestamps: true }
);

export default mongoose.model<IChat>("Chat", chatSchema);