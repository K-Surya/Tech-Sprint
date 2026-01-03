import { GoogleGenerativeAI } from "@google/generative-ai";
import { createStudyPlan } from "./studyPlan.service.js";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

async function generateStudyPlan(kms, metrics, weaknessLevel, daysRemaining) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
    You are an expert academic counselor and study strategist.
    Based on the following student performance metrics and time constraint, generate a personalized study plan for the remaining days until the exam.

    Time Constraint:
    - Days remaining until exam: ${daysRemaining} days

    Performance Metrics:
    - Knowledge Mastery Score (KMS): ${kms} (0 to 1 scale)
    - Average Score: ${metrics.avgScore}
    - Progress Trend: ${metrics.trend}
    - Consistency: ${metrics.consistency}
    - Topic Coverage: ${metrics.coverage}
    - Current Weakness Level: ${weaknessLevel}

    STRICT RULES (VERY IMPORTANT):
    - Return ONLY valid JSON.
    - Create a ${daysRemaining}-day plan (one entry for each day).
    - Each day must have a "day" (number), "focus" (string), and "tasks" (array of strings).

    The final output must be a single JSON object in this exact shape:
    {
      "plan": [
        {
          "day": 1,
          "focus": "Topic/Area Name",
          "tasks": ["Task 1", "Task 2"]
        },
        ...
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean potential markdown or extra text
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    return parsedData.plan || parsedData;
  } catch (error) {
    console.error("Error in generateStudyPlan service:", error);
    // Fallback using the existing studyPlan service
    const fallback = createStudyPlan(kms);
    return [
      { day: 1, focus: fallback.planType, tasks: [fallback.strategy, "Review key concepts from lectures"] },
      { day: 2, focus: "Mixed Practice", tasks: ["Solve practice questions", "Review weak topics"] },
      { day: 3, focus: "Application", tasks: ["Apply learned concepts to new problems"] },
      { day: 4, focus: "Revision", tasks: ["Re-review previous materials"] },
      { day: 5, focus: "Mock Test", tasks: ["Attempt a short quiz or mock test"] },
      { day: 6, focus: "Deep Dive", tasks: ["Explore advanced aspects of the subject"] },
      { day: 7, focus: "Final Review", tasks: ["Consolidate all knowledge for the week"] }
    ];
  }
}

export default generateStudyPlan;
