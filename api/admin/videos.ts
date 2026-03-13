import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../lib/db.js";
import { requireAuth } from "../lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAuth(req, res))) return;

  switch (req.method) {
    case "GET": {
      const result = await db.execute(
        "SELECT * FROM videos ORDER BY sort_order ASC, id ASC"
      );
      return res.json(result.rows);
    }

    case "POST": {
      const { youtube_id, title } = req.body;
      if (!youtube_id) {
        return res.status(400).json({ error: "youtube_id es requerido" });
      }
      const maxOrder = await db.execute(
        "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM videos"
      );
      const nextOrder = (maxOrder.rows[0] as any).next_order;
      const result = await db.execute({
        sql: "INSERT INTO videos (youtube_id, title, sort_order) VALUES (?, ?, ?)",
        args: [youtube_id, title || "", nextOrder],
      });
      return res.status(201).json({
        id: Number(result.lastInsertRowid),
        youtube_id,
        title: title || "",
        sort_order: nextOrder,
      });
    }

    case "PUT": {
      const { id, youtube_id, title, sort_order } = req.body;
      if (!id) return res.status(400).json({ error: "id es requerido" });

      if (sort_order !== undefined) {
        await db.execute({
          sql: "UPDATE videos SET sort_order = ? WHERE id = ?",
          args: [sort_order, id],
        });
      }
      if (youtube_id !== undefined || title !== undefined) {
        const sets: string[] = [];
        const args: any[] = [];
        if (youtube_id !== undefined) {
          sets.push("youtube_id = ?");
          args.push(youtube_id);
        }
        if (title !== undefined) {
          sets.push("title = ?");
          args.push(title);
        }
        if (sets.length > 0) {
          args.push(id);
          await db.execute({
            sql: `UPDATE videos SET ${sets.join(", ")} WHERE id = ?`,
            args,
          });
        }
      }
      return res.json({ success: true });
    }

    case "DELETE": {
      const deleteId = req.query.id || req.body?.id;
      if (!deleteId) return res.status(400).json({ error: "id es requerido" });
      await db.execute({ sql: "DELETE FROM videos WHERE id = ?", args: [Number(deleteId)] });
      return res.json({ success: true });
    }

    default:
      res.setHeader("Allow", "GET, POST, PUT, DELETE");
      return res.status(405).json({ error: "Method not allowed" });
  }
}
