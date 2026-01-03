import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ GEMINI_API_KEY NOT FOUND");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, respond with 'Model is working'");
        console.log(`✅ ${modelName} success:`, result.response.text());
        return true;
    } catch (error) {
        console.error(`❌ ${modelName} failure:`, error.message);
        return false;
    }
}

async function runTests() {
    const models = ["gemini-2.5-flash", "gemini-3-flash"];
    for (const m of models) {
        await testModel(m);
    }
}

runTests();
