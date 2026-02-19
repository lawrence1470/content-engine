import "dotenv/config";
import express from "express";
import webhookRouter from "./routes/webhook";
import { startScheduler } from "./scheduler/cron";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/webhook", webhookRouter);

// Start
app.listen(PORT, () => {
  console.log(`Content Engine running on port ${PORT}`);
  startScheduler();
});
