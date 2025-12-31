import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_ROADMAP || process.env.GEMINI_API_KEY_NOTES || process.env.GEMINI_API_KEY_QUIZ);

async function generateRoadmap(subject, examDate, topics = []) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemma-7b",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
    You are a professional study strategist and educational consultant.
    Your goal is to create a comprehensive study roadmap for a student preparing for an exam.

    Subject: ${subject}
    Exam Date: ${examDate || "Not specified"}
    Completed/Available Topics: ${topics.length > 0 ? topics.join(", ") : "None specified"}

    STRICT RULES:
    1. Return ONLY valid JSON.
    2. Create a roadmap with exactly 4-5 "Phases".
    3. Each phase must have:
       - phaseName (string)
       - duration (string, e.g., "Day 1-2" or "Phase 1")
       - focus (string)
       - tasks (array of strings)
    4. The roadmap should be logical and move from basic core concepts to advanced application and final revision.

    The final output must be a single JSON object in this exact shape:
    {
      "roadmap": [
        {
          "phaseName": "Foundation Phase",
          "duration": "Day 1-2",
          "focus": "Core concepts and terminology",
          "tasks": ["Review intro notes", "Master basic definitions"]
        },
        ...
      ]
    }
  `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(cleanJson);
        return parsedData.roadmap || parsedData;
    } catch (error) {
        console.error("Error in generateRoadmap service:", error);
        // Fallback roadmap
        return [
            {
                phaseName: "Fundamentals",
                duration: "Initial Phase",
                focus: "Core principles of " + subject,
                tasks: ["Master basic terminology", "Review introductory chapters"]
            },
            {
                phaseName: "Core Concepts",
                duration: "Intensive Phase",
                focus: "Deep dive into main topics",
                tasks: ["Study key theoretical frameworks", "Complete standard practice problems"]
            },
            {
                phaseName: "Application",
                duration: "Practice Phase",
                focus: "Complex problem solving",
                tasks: ["Solve previous year questions", "Work on case studies"]
            },
            {
                phaseName: "Final Revision",
                duration: "Consolidation Phase",
                focus: "Mock exams and revision",
                tasks: ["Take full length mock tests", "Quick review of all summary notes"]
            }
        ];
    }
}

export default generateRoadmap;
