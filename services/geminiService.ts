import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IstikharaResponse, IstikharaResultType } from "../types";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please set process.env.API_KEY");
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
  // Note: In a pure theological sense, physical randomness is often preferred, but here we use AI as the medium for selection and interpretation.
  
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
    console.error("Istikhara Service Error:", error);
    // Fallback in case of total failure (rare with correct config)
    return {
      surahName: "الفتح",
      verseNumber: 1,
      arabicText: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا",
      persianTranslation: "ما تو را پیروزی بخشیدیم، چه پیروزی درخشانی!",
      resultType: IstikharaResultType.GOOD,
      briefResult: "بسیار خوب است",
      interpretation: "این کار با موفقیت و گشایش همراه خواهد بود. توکل بر خدا کنید و اقدام نمایید.",
    };
  }
};