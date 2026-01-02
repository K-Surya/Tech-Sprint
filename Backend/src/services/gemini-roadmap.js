import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

console.log("--- Roadmap Service Info ---");
console.log("Using API Key (type):", process.env.GEMINI_API_KEY ? "STUDY_PLAN (High Tier)" : "Fallback");
console.log("API Key configured:", !!apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

async function generateRoadmap(subject, examDate, topics = []) {
    console.log(`Generating roadmap for ${subject} with ${topics.length} lectures...`);
    try {
        const model = genAI.getGenerativeModel({
            model: "gemma-7b",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
    You are an expert academic counselor and study strategist.
    Based on the following subject and lecture content, generate a personalized study roadmap for the student.

    Subject: ${subject}
    Exam Date: ${examDate || "Not specified"}
    
    Lecture Content/Topics:
    ${topics.length > 0 ? topics.join("\n") : "General subject overview (no specific lectures provided)"}

    STRICT RULES:
    1. Return ONLY valid JSON.
    2. Create a 7-day master plan organized into logical "Phases".
    3. Each phase must have:
       - phaseName (string)
       - duration (string, e.g., "Day 1-2")
       - focus (string)
       - tasks (array of strings)
    4. Ensure the tasks are directly derived from the topics provided in the lecture content.
    5. The roadmap should move from core concepts to application and final revision.

    The final output must be a single JSON object in this exact shape:
    {
      "roadmap": [
        {
          "phaseName": "Foundation Phase",
          "duration": "Day 1-2",
          "focus": "Core concepts and terminology",
          "tasks": ["Task specific to lecture 1", "Task specific to lecture 2"]
        },
        ...
      ]
    }
  `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Clean potential markdown or extra text
        let cleanJson = responseText.trim();
        if (cleanJson.includes("```json")) {
            cleanJson = cleanJson.split("```json")[1].split("```")[0];
        } else if (cleanJson.includes("```")) {
            cleanJson = cleanJson.split("```")[1].split("```")[0];
        }

        const parsedData = JSON.parse(cleanJson.trim());
        return parsedData.roadmap || parsedData.plan || parsedData;
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
