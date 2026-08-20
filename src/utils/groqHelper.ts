import { groq } from "../lib/groq";
import { ChatCompletion, ChatCompletionCreateParams } from "groq-sdk/resources/chat/completions";

const DEFAULT_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.1-8b-instant"];

export async function callGroqChatCompletion(params: Omit<ChatCompletionCreateParams, "model" | "stream">): Promise<ChatCompletion> {
    const models = process.env.GROQ_MODEL ? process.env.GROQ_MODEL.split(",") : DEFAULT_MODELS;
    
    for (const model of models) {
        try {
            console.log(`Attempting to use Groq model: ${model}`);
            const completion = await groq.chat.completions.create({
                ...params,
                model,
                stream: false,
            });
            console.log(`Successfully used Groq model: ${model}`);
            return completion as ChatCompletion;
        } catch (error: any) {
            // Check for specific errors
            const errorMessage = (error?.error?.message || error?.message || "").toLowerCase();
            const isDecommissioned = errorMessage.includes("model_decommissioned") || errorMessage.includes("model_not_found");
            
            if (isDecommissioned) {
                console.warn(`Model ${model} failed with: ${errorMessage}. Trying next model...`);
                continue;
            }
            
            // Re-throw if it's a different error
            throw error;
        }
    }
    
    throw new Error("All configured Groq models failed.");
}
