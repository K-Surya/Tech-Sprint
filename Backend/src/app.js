import express from "express";
import cors from "cors";
import router from "./routes/notes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/benchmate',router);

export default app;