
import { GoogleGenAI, Type } from "@google/genai";
import { WorkType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const suggestTaskType = async (title: string, description: string): Promise<WorkType> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this task into one of three types: RED (Urgent/Critical), YELLOW (Standard/Active), or GREEN (Low Priority/Maintenance). 
      Task Title: ${title}
      Description: ${description}
      Respond with ONLY the word RED, YELLOW, or GREEN.`,
    });

    const result = response.text.trim().toUpperCase();
    if (result.includes('RED')) return WorkType.RED;
    if (result.includes('YELLOW')) return WorkType.YELLOW;
    if (result.includes('GREEN')) return WorkType.GREEN;
    return WorkType.YELLOW;
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return WorkType.YELLOW;
  }
};

export const generateTaskAnalysis = async (tasks: any[]) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analyze these work tasks and provide a brief productivity tip (max 30 words): ${JSON.stringify(tasks)}`
        });
        return response.text;
    } catch (e) {
        return "Keep focusing on your high-priority items!";
    }
}
