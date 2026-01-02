import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateNotes = async (transcript, subject) => {
  const model = genAI.getGenerativeModel({ model: "gemma-7b" });

  const prompt = `
    You are an academic assistant for college students.

    Subject: ${subject || "Computer Science"}
    
    Convert the following lecture transcript into:
    - Structured notes
    - Clear headings and subheadings
    - Bullet points
    - Definitions
    - Highlight exam-important points

    Transcript:
    ${transcript}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default generateNotes;