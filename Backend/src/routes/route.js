import express from "express";
import generateNotes from "../services/gemini-notes.js";
import generateQuiz from "../services/gemini-quiz.js";

const router = express.Router();

router.post("/notes", async (req, res) => {
  const { transcript, subject } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript required" });
  }

  const notes = await generateNotes(transcript, subject);

  res.json({ notes });
});

router.post("/quiz", async (req, res) => {
  const { summary, subject } = req.body;

  if (!summary) {
    return res.status(400).json({ error: "Summary required" });
  }

  const quiz = await generateQuiz(subject, summary);

  res.json({ quiz });
});


router.post("/flashcards", async (req, res) => {
  try {
    const { processedText } = req.body;

    if (!processedText) {
      return res.status(400).json({ error: "processedText is required" });
    }

    const flashcards = await generateFlashcardsFromText(processedText);
    res.json(flashcards);
  } catch (err) {
    console.error("Flashcard error:", err.message);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

export default router;
