// server/routes.ts
import type { Express, RequestHandler } from "express";
import { z } from "zod";
import { insertContactSubmissionSchema } from "@shared/schema";
import { storage } from "./storage";

// Auth guard (relies on session middleware already set in server/app.ts)
const isAuthenticated: RequestHandler = (req, res, next) => {
  const user = (req.session as any)?.user;
  if (user) return next();
  return res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<void> {
  // Ensure a default admin exists (safe to call on cold start)
  try {
    await storage.createDefaultAdminUser();
  } catch (err) {
    console.error("createDefaultAdminUser failed:", err);
  }

  // --- Admin login ---
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body ?? {};
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const user = await storage.validateUserPassword(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      (req.session as any).user = {
        id: user.id,
        username: user.username,
        role: user.role ?? "admin",
      };

      res.json({
        success: true,
        message: "Logged in successfully",
        user: { id: user.id, username: user.username, role: user.role ?? "admin" },
      });
    } catch (err) {
      console.error("admin/login error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- Who am I (current admin) ---
  app.get("/api/admin/user", isAuthenticated, (req, res) => {
    res.json((req.session as any).user);
  });

  // --- Admin logout ---
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  // --- Create contact submission (public) ---
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);

      res.status(201).json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        id: submission.id,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Please check your form data",
          errors: err.issues,
        });
      }
      console.error("contact submit error:", err);
      res
        .status(500)
        .json({ success: false, message: "Something went wrong. Please try again later." });
    }
  });

  // --- List submissions (admin only) ---
  app.get("/api/admin/contact-submissions", isAuthenticated, async (_req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (err) {
      console.error("admin/contact-submissions error:", err);
      res.status(500).json({ message: "Failed to retrieve contact submissions" });
    }
  });
}
