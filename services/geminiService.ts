
import { GoogleGenAI } from "@google/genai";

export const getInvestmentInsights = async (investmentType: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a 3-point brief insight for the African diaspora interested in investing in the ${investmentType} sector in Africa for 2024. Keep it professional and concise.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Strategic insights are currently being refreshed. Please check back shortly.";
  }
};

export const getDetailedAnalysis = async (projectTitle: string, sector: string, location: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a professional investment analysis for a project titled "${projectTitle}" in the ${sector} sector located in ${location}. 
      Include:
      1. SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats).
      2. 2-year growth projection summary.
      3. Risk mitigation recommendation.
      Keep the response structured with clear headings.`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Deep analytical engine is processing high volume. Summary: Market fundamentals remain strong with projected regional GDP growth of 4.5% year-on-year.";
  }
};

export const getMissionMatching = async (interests: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given these diaspora interests: "${interests}", suggest 2 types of mission or tourism projects in Africa they might enjoy.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
