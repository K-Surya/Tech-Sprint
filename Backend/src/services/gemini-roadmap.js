import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

console.log("--- Roadmap Service Info ---");
console.log("Using API Key (type):", process.env.GEMINI_API_KEY ? "STUDY_PLAN (High Tier)" : "Fallback");
console.log("API Key configured:", !!apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

async function generateRoadmap(subject, examDate, topics = []) {
    let daysRemaining = 7; // Default
    let durationText = "7 days";

    if (examDate && examDate !== "Not specified") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const exam = new Date(examDate);
        exam.setHours(0, 0, 0, 0);

        const diffTime = exam - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            daysRemaining = diffDays;
            durationText = `${daysRemaining} days`;
        } else if (diffDays === 0) {
            daysRemaining = 1;
            durationText = "1 day (Final Revision)";
        }
    }

    console.log(`Generating ${durationText} roadmap for ${subject} (Exam: ${examDate || 'None'})`);

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
    You are an expert academic counselor and study strategist.
    Based on the following subject and lecture content, generate a personalized study roadmap for the student.

    Subject: ${subject}
    Exam Date: ${examDate || "Not specified"}
    Time Remaining: ${durationText}
    
    Lecture Content/Topics:
    ${topics.length > 0 ? topics.join("\n") : "General subject overview (no specific lectures provided)"}

    STRICT RULES:
    1. Return ONLY valid JSON.
    2. Create a ${durationText} master plan organized into logical "Phases".
    3. If the duration is long (e.g. > 14 days), group days into weeks (e.g. "Week 1", "Week 2"). If short (< 14 days), groups days (e.g "Day 1-2").
    4. Each phase must have:
       - phaseName (string)
       - duration (string)
       - focus (string)
       - tasks (array of strings)
    5. Ensure the tasks are directly derived from the topics provided in the lecture content.
    6. The roadmap should move from core concepts to application and final revision.
    7. Plan specifically for the available time of ${durationText}.

    The final output must be a single JSON object in this exact shape:
    {
      "roadmap": [
        {
          "phaseName": "Foundation Phase",
          "duration": "Day 1${daysRemaining > 1 ? '-2' : ''}",
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
