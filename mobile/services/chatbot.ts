import { ai } from "@/config/gemini";

export const getAIResponse = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Answer (max 100 words): " + input,
    });  

    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return null;
  }
};