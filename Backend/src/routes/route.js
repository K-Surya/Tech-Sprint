import express from "express";
import generateNotes from "../services/gemini-notes.js";
import generateQuiz from "../services/gemini-quiz.js";
import generateFlashcards from "../services/gemini-flashcards.js";
import { processQuizData, generateRoadmapForSubject } from "../services/pipeline.service.js";
import generateRoadmap from "../services/gemini-roadmap.js";
import { getLearningCurveData } from "./analytics.controller.js";
import multer from "multer";
import { uploadToGoogleDrive } from "../services/google-drive.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/notes", async (req, res) => {
  try {
    const { transcript, subject } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript required" });
    }

    const notes = await generateNotes(transcript, subject);
    res.json({ notes });
  } catch (error) {
    console.error("Notes generation error:", error.message);
    const status = error.status || error.statusCode || 500;
    res.status(status).json({
      error: "Failed to generate notes",
      details: error.message
    });
  }
});

router.post("/quiz", async (req, res) => {
  try {
    const { summary, subject } = req.body;

    if (!summary) {
      return res.status(400).json({ error: "Summary required" });
    }

    const quiz = await generateQuiz(subject, summary);
    res.json({ quiz });
  } catch (error) {
    console.error("Quiz generation error:", error.message);
    const status = error.status || error.statusCode || 500;
    res.status(status).json({
      error: "Failed to generate quiz",
      details: error.message
    });
  }
});


router.post("/flashcards", async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ error: "processedText is required" });
    }

    const flashcards = await generateFlashcards(summary);
    res.json({ flashcards });
  } catch (err) {
    console.error("Flashcard error:", err.message);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

router.post("/analyze", async (req, res) => {
  try {
    const { subjectId, lectures, examDate } = req.body;

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

router.post("/roadmap", async (req, res) => {
  try {
    const { subject, examDate, lectures } = req.body;

    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    const roadmap = await generateRoadmapForSubject(req.body);
    res.json({ roadmap });
  } catch (err) {
    console.error("Roadmap error:", err.message);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

router.post("/learning-curve/:userId", getLearningCurveData);

router.post("/upload-to-drive", upload.single("file"), async (req, res) => {
  try {
    const { accessToken, fileName } = req.body;
    const file = req.file;

    console.log("📂 [Drive Upload Request]:", {
      bodyKeys: Object.keys(req.body),
      fileName: req.body.fileName,
      hasToken: !!req.body.accessToken,
      fileReceived: !!req.file,
      fileField: req.file?.fieldname,
      fileSize: req.file?.size
    });

    if (!file || !accessToken) {
      return res.status(400).json({ error: "File and accessToken are required" });
    }

    const result = await uploadToGoogleDrive(file, accessToken, fileName || "Notes.pdf");
    res.json({ success: true, result });
  } catch (error) {
    console.error("❌ [Drive Route Error]:", error);
    res.status(500).json({
      error: "Failed to upload to Google Drive",
      details: error.message,
      stack: error.stack,
      raw: error
    });
  }
});

export default router;
