// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
if (url.includes("-pooler") || url.includes("channel_binding=")) {
  throw new Error("DATABASE_URL must be the Neon compute endpoint (no '-pooler', no 'channel_binding').");
}

export const pool = new Pool({ connectionString: url });
export const db = drizzle({ client: pool, schema });
