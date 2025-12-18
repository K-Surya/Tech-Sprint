import express from "express";
import generateNotes from "../services/gemini.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { transcript, subject } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript required" });
  }

  const notes = await generateNotes(transcript, subject);

  res.json({ notes });
});

export default router;