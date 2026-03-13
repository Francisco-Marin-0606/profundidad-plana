import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../lib/db.js";
import { requireAuth } from "../lib/auth.js";

async function buildSnapshot() {
  const [videosRes, projectsRes, imagesRes, settingsRes] = await Promise.all([
    db.execute("SELECT * FROM videos ORDER BY sort_order ASC, id ASC"),
    db.execute("SELECT * FROM projects ORDER BY sort_order ASC, id ASC"),
    db.execute("SELECT * FROM project_images ORDER BY sort_order ASC, id ASC"),
    db.execute("SELECT key, value FROM settings WHERE key NOT LIKE '\\_%' ESCAPE '\\'"),
  ]);

  const projects = projectsRes.rows.map((p: any) => ({
    ...p,
    images: imagesRes.rows.filter((img: any) => img.project_id === p.id),
  }));

  const settings: Record<string, string> = {};
  for (const row of settingsRes.rows as any[]) {
    settings[row.key] = row.value;
  }

  return { videos: videosRes.rows, projects, settings };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAuth(req, res))) return;

  try {
    const snapshot = await buildSnapshot();
    const json = JSON.stringify(snapshot);

    await db.execute({
      sql: "INSERT INTO settings (key, value) VALUES ('_published_snapshot', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      args: [json],
    });

    return res.json({ success: true, published_at: new Date().toISOString() });
  } catch (error: any) {
    console.error("Error publishing:", error);
    return res.status(500).json({ error: "Error al publicar" });
  }
}
