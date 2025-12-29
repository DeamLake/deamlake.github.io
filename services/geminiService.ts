
import { GoogleGenAI, Type } from "@google/genai";
import { WorkType } from "../types";

// 使用 Vite 的 import.meta.env 或通过 define 注入的环境变量
// @ts-ignore - Vite 会在构建时注入这些变量
const apiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY || (process.env as any).API_KEY || '').trim();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const suggestTaskType = async (title: string, description: string): Promise<WorkType> => {
  if (!ai) {
    console.warn("Gemini API not configured, using default YELLOW type");
    return WorkType.YELLOW;
  }
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
    if (!ai) {
        return "Keep focusing on your high-priority items!";
    }
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
