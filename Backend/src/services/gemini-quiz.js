import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuiz(subject, summary) {
  const model = genAI.getGenerativeModel({
    model: "gemma-7b",
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

    // Clean potential markdown or extra text (though responseMimeType should handle it)
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    // Return only the quiz array to the caller
    return parsedData.quiz || parsedData;
  } catch (error) {
    console.error("Error in generateQuiz service:", error);
    throw new Error("Failed to generate or parse quiz JSON");
  }
}

export default generateQuiz;