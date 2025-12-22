import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateFlashcardsFromText(text) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in environment");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.5,
      responseMimeType: "application/json"
    }
  });

  const prompt = `
Create 5 exam-oriented flashcards.

Rules:
- Output ONLY JSON array
- Each object must have "front" and "back"

Text:
${text}
`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
