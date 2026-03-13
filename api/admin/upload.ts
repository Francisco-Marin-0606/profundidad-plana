import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { requireAuth } from "../lib/auth.js";

function collectBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

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
    const body = await collectBody(req);

    if (!body.length) {
      return res.status(400).json({ error: "No se recibio ningun archivo" });
    }

    const blob = await put(
      `profundidad-plana/${Date.now()}-${filename}`,
      body,
      { access: "public" }
    );

    return res.json({ url: blob.url });
  } catch (error: any) {
    console.error("Upload error:", error?.message || error);
    return res.status(500).json({
      error: "Error al subir el archivo",
      detail: error?.message,
    });
  }
}
