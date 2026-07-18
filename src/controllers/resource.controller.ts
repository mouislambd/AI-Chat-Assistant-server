import { Request, Response } from "express";
import Resource from "../models/resource.model";
import { groq } from "../lib/groq";

export const createResource = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { title, description, category, level, tags, link } = req.body;

        const resource = new Resource({
            title,
            description,
            category,
            level,
            tags,
            link,
            createdBy: user.id,
        });

        await resource.save();
        res.status(201).json({ resource });
    } catch (error) {
        console.error("ERROR in createResource:", error);
        res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
    }
};

export const getResources = async (req: Request, res: Response) => {
    try {
        const { category, level, search } = req.query;
        const query: any = {};

        if (category) query.category = category;
        if (level) query.level = level;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { tags: { $in: [search] } },
            ];
        }

        const resources = await Resource.find();
        res.status(200).json({ resources });
    } catch (error) {
        console.error("ERROR in getResources:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { interest } = req.body;
        if (!interest) {
            return res.status(400).json({ message: "Interest is required" });
        }

        const resources = await Resource.find();
        
        const resourceContext = resources.map(r => `ID: ${r._id}, Title: ${r.title}, Description: ${r.description}, Category: ${r.category}`).join("\n");

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: `You are an AI Smart Recommendation Engine. Analyze the user's interest and suggest the top 3 resources from the provided list. Return ONLY JSON in this format: { "recommendations": [ { "resourceId": string, "reason": string } ] }.` 
                },
                { 
                    role: "user", 
                    content: `User Interest: ${interest}\n\nResources:\n${resourceContext}` 
                }
            ],
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0]?.message?.content || '{"recommendations": []}');
        res.status(200).json(aiResponse);
    } catch (error) {
        console.error("ERROR in getRecommendations:", error);
        res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedResource = await Resource.findByIdAndDelete(id);
        if (!deletedResource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("ERROR in deleteResource:", error);
        res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
    }
};
