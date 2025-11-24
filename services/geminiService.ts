import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IstikharaResponse, IstikharaResultType } from "../types";

// In Vite applications, we must use import.meta.env to access environment variables.
// The variable MUST start with VITE_ to be exposed to the browser.
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  console.error("CRITICAL ERROR: API Key is missing. Please ensure 'VITE_API_KEY' is set in your .env file or Netlify Environment Variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Schema for the AI response to ensure strict typing
const istikharaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    surahName: { type: Type.STRING, description: "Name of the Surah in Persian/Arabic" },
    verseNumber: { type: Type.INTEGER, description: "The specific verse number selected" },
    arabicText: { type: Type.STRING, description: "The full Arabic text of the verse" },
    persianTranslation: { type: Type.STRING, description: "Fluent Persian translation of the verse" },
    resultType: { 
      type: Type.STRING, 
      enum: ['GOOD', 'BAD', 'MODERATE'], 
      description: "The categorization of the Istikhara result" 
    },
    briefResult: { type: Type.STRING, description: "Short result phrase like 'بسیار خوب است' or 'انجام ندهید'" },
    interpretation: { type: Type.STRING, description: "Detailed interpretation and advice based on the verse and user's specific intention" },
  },
  required: ["surahName", "verseNumber", "arabicText", "persianTranslation", "resultType", "briefResult", "interpretation"],
};

export const performIstikhara = async (userIntention: string): Promise<IstikharaResponse> => {
  // We simulate the randomness of opening the Quran by asking the AI to pick a random page/verse conceptually, 
  // but heavily influenced by the nature of Istikhara (guidance).
  
  const prompt = `
    You are a wise and spiritual Islamic scholar providing an 'Istikhara' (guidance seeking) service.
    
    The user has a specific intention: "${userIntention ? userIntention : 'General Guidance (Niyyat)'}".
    
    Please perform the following steps:
    1. Select a random verse from the Holy Quran. (Simulate opening the book at random).
    2. Analyze if this verse implies a Good, Bad, or Moderate outcome for doing the task the user intends.
    3. Provide the Arabic text and Persian translation.
    4. Provide a spiritual interpretation tailored to the user's intention in Persian.
    
    Strictly follow the JSON schema provided.
    The tone should be respectful, spiritual, and comforting.
    Translate everything to Persian (Farsi).
  `;

  try {
    // Check if API key is present before making the call
    if (!apiKey) {
      throw new Error("API Key is not configured correctly.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: istikharaSchema,
        temperature: 1.2, // Higher temperature for more variety/randomness in verse selection
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const data = JSON.parse(resultText) as IstikharaResponse;
    return data;
  } catch (error) {
    console.error("Istikhara Service Error Details:", error);
    
    // Detailed error logging to help debugging in browser console
    if (error instanceof Error) {
        console.error("Error Message:", error.message);
    }

    // Fallback in case of total failure
    return {
      surahName: "الفتح",
      verseNumber: 1,
      arabicText: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا",
      persianTranslation: "ما تو را پیروزی بخشیدیم، چه پیروزی درخشانی!",
      resultType: IstikharaResultType.GOOD,
      briefResult: "خطا در ارتباط",
      interpretation: "متاسفانه ارتباط با هوش مصنوعی برقرار نشد. لطفا بررسی کنید که کلید API (VITE_API_KEY) به درستی در تنظیمات Netlify وارد شده باشد.",
    };
  }
};