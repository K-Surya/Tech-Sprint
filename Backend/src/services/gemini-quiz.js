import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_QUIZ);

async function generateQuiz(subject, summary) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an experienced exam question setter.

    Subject: ${subject}

    You are given structured summary notes of a lecture.
    Using ONLY the information in these notes, generate a quiz with EXACTLY 10 multiple-choice questions.

    STRICT RULES (VERY IMPORTANT):
    - Do NOT include question numbers like Q1, Q2, etc.
    - Do NOT include A), B), C), D) labels
    - Output ONLY valid JSON
    - Do NOT include any text before or after the JSON
    - Do NOT wrap the response in markdown or code blocks

    Each question must be an object with the following keys:
    - question (string)
    - options (object with keys A, B, C, D)
    - correctAnswer (string: "A" | "B" | "C" | "D")
    - explanation (string, 1–2 lines)

    The final output must be a single JSON object in this exact shape:

    {
      "quiz": [
        {
          "question": "",
          "options": {
            "A": "",
            "B": "",
            "C": "",
            "D": ""
          },
          "correctAnswer": "",
          "explanation": ""
        }
      ]
    }

    Generate EXACTLY 10 question objects inside the quiz array.

    IMPORTANT:
    Return ONLY the JSON object.
    Do NOT wrap it inside another object.
    Do NOT put it inside quotes.
    Do NOT use markdown.

    Summary Notes:
    ${summary}
  `;



  const result = await model.generateContent(prompt);
  return result.response.text();
}

export default generateQuiz;