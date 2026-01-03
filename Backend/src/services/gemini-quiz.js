import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuiz(subject, summary) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
    You are an experienced exam question setter.

    Subject: ${subject}

    You are given structured summary notes of a lecture.
    Using ONLY the information in these notes, generate a quiz with EXACTLY 5 multiple-choice questions.

    STRICT RULES (VERY IMPORTANT):
    - Return ONLY valid JSON
    - Each question must be an object with the following keys:
      - question (string)
      - options (object with keys A, B, C, D)
      - correctAnswer (string: "A" | "B" | "C" | "D")
      - explanation (string, 1–2 lines)

    The final output must be a single JSON object in this exact shape:
    {
      "quiz": [
        {
          "question": "The question text?",
          "options": {
            "A": "Option 1",
            "B": "Option 2",
            "C": "Option 3",
            "D": "Option 4"
          },
          "correctAnswer": "A",
          "explanation": "Why A is correct."
        }
      ]
    }

    Summary Notes:
    ${summary}
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      // Clean potential markdown or extra text
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanJson);
      return parsedData.quiz || parsedData;
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini response as JSON:");
      console.error("Response:", responseText);
      throw new Error("Failed to parse quiz data. Please try again.");
    }
  } catch (error) {
    console.error("Error in generateQuiz service:", error);
    throw error;
  }
}

export default generateQuiz;