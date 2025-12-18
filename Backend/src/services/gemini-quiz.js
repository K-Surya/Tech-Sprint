import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_QUIZ);

async function generateQuiz(subject, summary) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an experienced exam question setter.

    Subject: ${subject}

    You are given structured summary notes of a lecture.
    Using ONLY the information in these notes, generate a quiz with exactly 10 multiple-choice questions (MCQs).

    Rules:
    - Do not introduce concepts not present in the notes
    - Questions must be exam-oriented (conceptual, definition-based, and comparison-based)
    - Difficulty: medium
    - Each question must have 4 options (A, B, C, D)
    - Clearly indicate the correct answer
    - Provide a short explanation for the correct answer

    Summary Notes:
    ${summary}

    Output format (follow strictly):

    Q1. <question>
    A) <option>
    B) <option>
    C) <option>
    D) <option>
    Correct Answer: <letter>
    Explanation: <1-2 lines>

    Continue until Q10.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export default generateQuiz;