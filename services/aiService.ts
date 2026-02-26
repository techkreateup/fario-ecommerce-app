import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// Note: This requires VITE_GEMINI_API_KEY in your .env file
// We use import.meta.env for Vite environment variables
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY && API_KEY !== 'PLACEHOLDER_API_KEY') {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.warn("Gemini API Key is missing or invalid. AI features will be disabled.");
}

export const aiService = {
    /**
     * Checks if AI service is ready/configured
     */
    isReady: () => {
        return !!genAI;
    },

    /**
     * Generates a creative product description based on product name and tags
     */
    generateProductDescription: async (productName: string, tags: string[]) => {
        if (!genAI) return "AI Service Unavailable";

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Write a compelling, premium e-commerce product description for a shoe named "${productName}". 
            Key features: ${tags.join(', ')}. 
            Tone: Futuristic, High-Performance, Elite. 
            Keep it under 50 words.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Generation Error:", error);
            return "Failed to generate content.";
        }
    },

    /**
     * Analyzes customer sentiment from a review
     */
    analyzeSentiment: async (reviewText: string) => {
        if (!genAI) return { score: 0, summary: "AI Unavailable" };

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Analyze the sentiment of this review: "${reviewText}". 
            Return JSON only: { "score": number (1-10), "summary": "3 word summary" }`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            // Basic cleanup to ensure JSON parsing if model serves markdown
            const jsonStr = text.replace(/```json|```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("AI Analysis Error:", error);
            return { score: 0, summary: "Error" };
        }
    }
};
