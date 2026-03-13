import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { requireAuth } from "../lib/auth.js";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAuth(req, res))) return;

  const filename = req.query.filename as string;
  if (!filename) {
    return res.status(400).json({ error: "filename query param es requerido" });
  }

  try {
    const blob = await put(`profundidad-plana/${Date.now()}-${filename}`, req, {
      access: "public",
    });

    return res.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Error al subir el archivo" });
  }
}
