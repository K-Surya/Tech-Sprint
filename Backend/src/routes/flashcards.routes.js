import express from "express";
import { generateFlashcardsFromText } from "../services/gemini.service.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { processedText } = req.body;

    if (!processedText) {
      return res.status(400).json({
        error: "processedText is required"
      });
    }

    const flashcards = await generateFlashcardsFromText(processedText);

    res.json({
      status: "success",
      flashcards
    });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({
      error: "Failed to generate flashcards"
    });
  }
});

export default router;
