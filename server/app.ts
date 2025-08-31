// server/app.ts
import express from "express";
import { registerRoutes } from "./routes";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// register all middleware/routes here (or in api/index.ts — but not both)
await registerRoutes(app);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

export default app;
