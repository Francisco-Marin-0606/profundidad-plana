import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ error: "id es requerido" });
  }

  try {
    const result = await db.execute({
      sql: "SELECT content_type, data FROM images WHERE id = ?",
      args: [Number(id)],
    });

    if (!result.rows.length) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const row = result.rows[0] as any;
    const buffer = Buffer.from(row.data, "base64");

    res.setHeader("Content-Type", row.content_type);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(buffer);
  } catch (error) {
    console.error("Image serve error:", error);
    res.status(500).json({ error: "Error al cargar la imagen" });
  }
}
