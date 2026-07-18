import { Request, Response } from "express";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const db = mongoose.connection.db;
        if (!db) throw new Error("Database not connected");

        const users = await db
            .collection("user")
            .find({})
            .project({ name: 1, email: 1, role: 1, createdAt: 1 })
            .toArray();

        res.status(200).json({ users });
    } catch (error) {
        console.error("ERROR in getAllUsers:", error);
        res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["student", "mentor", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const db = mongoose.connection.db;
        if (!db) throw new Error("Database not connected");

        const result = await db.collection("user").updateOne(
            { _id: new ObjectId(id as string) },
            { $set: { role } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User role updated successfully" });
    } catch (error) {
        console.error("ERROR in updateUserRole:", error);
        res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const db = mongoose.connection.db;
        if (!db) throw new Error("Database not connected");

        const result = await db.collection("user").deleteOne({ _id: new ObjectId(id as string) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("ERROR in deleteUser:", error);
        res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
    }
};
