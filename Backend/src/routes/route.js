import express from "express";
import generateNotes from "../services/gemini-notes.js";
import generateQuiz from "../services/gemini-quiz.js";
import generateFlashcards from "../services/gemini-flashcards.js";
import { processQuizData } from "../services/pipeline.service.js";

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
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ error: "processedText is required" });
    }

    const flashcards = await generateFlashcards(summary);
    res.json({flashcards});
  } catch (err) {
    console.error("Flashcard error:", err.message);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

router.post("/analyze", async (req, res) => {
  try {
    const { subjectId, lectures } = req.body;

    if (!subjectId || !lectures) {
      return res.status(400).json({ error: "subjectId and lectures are required" });
    }

    const analysis = await processQuizData(req.body);
    res.json(analysis);
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ error: "Failed to generate analytics" });
  }
});

export default router;
