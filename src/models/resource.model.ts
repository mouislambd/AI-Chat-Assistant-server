import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
    title: string;
    description: string;
    category: string;
    level: "beginner" | "intermediate" | "advanced";
    tags: string[];
    link: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true, index: true },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: true,
        },
        tags: [{ type: String }],
        link: { type: String, required: true },
        createdBy: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IResource>("Resource", resourceSchema);