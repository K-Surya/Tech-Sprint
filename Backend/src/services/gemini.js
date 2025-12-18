import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Gemini key:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateNotes(transcript, subject) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
}

export default generateNotes;