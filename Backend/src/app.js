import express from "express";
import cors from "cors";
import flashcardRoutes from "./routes/flashcards.routes.js";

const app = express();

/* 👇 ADD THIS */
app.use(cors());

app.use(express.json());

app.use("/flashcards", flashcardRoutes);

export default app;
