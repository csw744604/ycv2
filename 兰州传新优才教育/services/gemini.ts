import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

// Initialize client if key is present
if (process.env.API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const polishText = async (text: string, context: string): Promise<string> => {
  if (!aiClient) {
    console.warn("Gemini API Key not found. Returning original text.");
    return text;
  }

  try {
    const prompt = `
      You are a professional copywriter for a high-end education institution in China called "Lanzhou Youcai Education".
      Please rewrite the following text to be more professional, inspiring, and concise.
      Context of this text: ${context}.
      
      Original Text:
      "${text}"

      Return ONLY the rewritten text, no explanations.
    `;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Fallback to original
  }
};