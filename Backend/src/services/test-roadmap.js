import dotenv from 'dotenv';
dotenv.config(); // dotenv will look for .env in the current directory or parent
import generateRoadmap from './gemini-roadmap.js';

async function test() {
    console.log("--- Roadmap Test Start ---");
    console.log("Environment Variables:");
    console.log("GEMINI_API_KEY_STUDY_PLAN:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    console.log("GEMINI_API_KEY_ROADMAP:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");

    try {
        console.log("Calling generateRoadmap...");
        const roadmap = await generateRoadmap("Physics", "2025-01-15", ["Lecture 1: Kinematics", "Lecture 2: Force"]);
        console.log("SUCCESS! Roadmap Result:");
        console.log(JSON.stringify(roadmap, null, 2));
    } catch (error) {
        console.error("FAILURE! Error Details:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
    }
    console.log("--- Roadmap Test End ---");
}

test();
