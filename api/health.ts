export const config = { runtime: "nodejs20.x" };
export default async function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true,
    hasDbUrl: !!process.env.DATABASE_URL,
    hasSessionDbUrl: !!process.env.SESSION_DB_URL,
    hasSecret: !!process.env.SESSION_SECRET,
  });
}