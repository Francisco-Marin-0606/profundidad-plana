import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../lib/db.js";
import { requireAuth } from "../lib/auth.js";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAuth(req, res))) return;

  try {
    const { filename, content_type, data } = req.body;

    if (!data || !filename) {
      return res.status(400).json({ error: "filename y data son requeridos" });
    }

    const result = await db.execute({
      sql: "INSERT INTO images (filename, content_type, data) VALUES (?, ?, ?)",
      args: [filename, content_type || "image/jpeg", data],
    });

    const id = Number(result.lastInsertRowid);
    const url = `/api/images/${id}`;

    return res.json({ url });
  } catch (error: any) {
    console.error("Upload error:", error?.message || error);
    return res.status(500).json({ error: "Error al subir el archivo" });
  }
}
