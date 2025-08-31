// server/app.ts
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";

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
// --------------------------------------------

// Register all middleware/routes AFTER session
await registerRoutes(app);

// Simple health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

export default app;
