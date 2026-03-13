import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../lib/db.js";
import { requireAuth } from "../lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAuth(req, res))) return;

  switch (req.method) {
    case "POST": {
      const { project_id, image_url } = req.body;
      if (!project_id || !image_url) {
        return res.status(400).json({ error: "project_id e image_url son requeridos" });
      }
      const maxOrder = await db.execute({
        sql: "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM project_images WHERE project_id = ?",
        args: [project_id],
      });
      const nextOrder = (maxOrder.rows[0] as any).next_order;
      const result = await db.execute({
        sql: "INSERT INTO project_images (project_id, image_url, sort_order) VALUES (?, ?, ?)",
        args: [project_id, image_url, nextOrder],
      });
      return res.status(201).json({
        id: Number(result.lastInsertRowid),
        project_id,
        image_url,
        sort_order: nextOrder,
      });
    }

    case "PUT": {
      const { id, sort_order } = req.body;
      if (!id) return res.status(400).json({ error: "id es requerido" });
      if (sort_order !== undefined) {
        await db.execute({
          sql: "UPDATE project_images SET sort_order = ? WHERE id = ?",
          args: [sort_order, id],
        });
      }
      return res.json({ success: true });
    }

    case "DELETE": {
      const deleteId = req.query.id || req.body?.id;
      if (!deleteId) return res.status(400).json({ error: "id es requerido" });
      await db.execute({
        sql: "DELETE FROM project_images WHERE id = ?",
        args: [Number(deleteId)],
      });
      return res.json({ success: true });
    }

    default:
      res.setHeader("Allow", "POST, PUT, DELETE");
      return res.status(405).json({ error: "Method not allowed" });
  }
}
