import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "./lib/db.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const snapshotRes = await db.execute({
      sql: "SELECT value FROM settings WHERE key = '_published_snapshot'",
      args: [],
    });

    if (snapshotRes.rows.length > 0 && (snapshotRes.rows[0] as any).value) {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.json(JSON.parse((snapshotRes.rows[0] as any).value));
    }

    // Fallback: read live data if no snapshot exists yet
    const [videosRes, projectsRes, imagesRes, settingsRes] = await Promise.all([
      db.execute("SELECT * FROM videos ORDER BY sort_order ASC, id ASC"),
      db.execute("SELECT * FROM projects ORDER BY sort_order ASC, id ASC"),
      db.execute("SELECT * FROM project_images ORDER BY sort_order ASC, id ASC"),
      db.execute("SELECT * FROM settings WHERE key NOT LIKE '\\_%' ESCAPE '\\'"),
    ]);

    const projects = projectsRes.rows.map((p: any) => ({
      ...p,
      images: imagesRes.rows.filter((img: any) => img.project_id === p.id),
    }));

    const settings: Record<string, string> = {};
    for (const row of settingsRes.rows as any[]) {
      settings[row.key] = row.value;
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.json({ videos: videosRes.rows, projects, settings });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Error al cargar el contenido" });
  }
}
