// server/app.ts
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { pool } from "./db";

const app = express();

// Trust proxy is required on Vercel so secure cookies work
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Session store (uses POOLER endpoint) ---
const PgSession = connectPgSimple(session);
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}
if (!process.env.SESSION_DB_URL && !process.env.DATABASE_URL) {
  throw new Error("SESSION_DB_URL or DATABASE_URL must be set");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PgSession({
      // Prefer the pooler URL for pg/pgbouncer; fall back to DATABASE_URL
      conString: process.env.SESSION_DB_URL || process.env.DATABASE_URL!,
      createTableIfMissing: true, // helpful on first deploy
      tableName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("API error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// --------------------------------------------

// Register all middleware/routes AFTER session
await registerRoutes(app);

// Simple health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/_diag/db", async (_req, res) => {
  try {
    const c = await pool.connect();
    const r = await c.query("select 1");
    c.release();
    res.json({ ok: true, result: r.rows[0] });
  } catch (e: any) {
    console.error("DB diag error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 2b) Session probe
app.get("/api/_diag/session", (req: any, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.json({ ok: true, views: req.session.views });
});

export default app;
