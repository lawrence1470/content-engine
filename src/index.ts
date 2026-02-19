import "dotenv/config";
import express from "express";
import { loadConfig } from "./config/env";
import webhookRouter from "./routes/webhook";

const config = loadConfig();

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/webhook", webhookRouter);

app.listen(config.PORT, () => {
  console.log(`Content Engine running on port ${config.PORT}`);
});
