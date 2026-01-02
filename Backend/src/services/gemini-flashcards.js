import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function generateFlashcards(text) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in environment");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemma-7b",
    generationConfig: {
      temperature: 0.5,
      responseMimeType: "application/json"
    }
  });

  const prompt = `
    Generate 5 high-quality, exam-oriented flashcards based on the text provided below.
    Rules:
    1. Return ONLY a valid JSON array of objects.
    2. Each object must have: "id" (number), "front" (question), "back" (answer).

    Text to process:
    ${text}
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
