import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../lib/db.js";
import { requireAuth } from "../lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAuth(req, res))) return;

  switch (req.method) {
    case "GET": {
      const result = await db.execute("SELECT * FROM settings");
      const settings: Record<string, string> = {};
      for (const row of result.rows as any[]) {
        settings[row.key] = row.value;
      }
      return res.json(settings);
    }

    case "PUT": {
      const entries = Object.entries(req.body ?? {});
      if (entries.length === 0) {
        return res.status(400).json({ error: "No hay datos para guardar" });
      }
      const batch = entries.map(([key, value]) => ({
        sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        args: [key, String(value)],
      }));
      await db.batch(batch);
      return res.json({ success: true });
    }

    default:
      res.setHeader("Allow", "GET, PUT");
      return res.status(405).json({ error: "Method not allowed" });
  }
}
