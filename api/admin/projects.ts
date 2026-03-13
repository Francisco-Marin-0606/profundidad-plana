import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../lib/db.js";
import { requireAuth } from "../lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAuth(req, res))) return;

  switch (req.method) {
    case "GET": {
      const [projectsRes, imagesRes] = await Promise.all([
        db.execute("SELECT * FROM projects ORDER BY sort_order ASC, id ASC"),
        db.execute("SELECT * FROM project_images ORDER BY sort_order ASC, id ASC"),
      ]);
      const projects = projectsRes.rows.map((p: any) => ({
        ...p,
        images: imagesRes.rows.filter((img: any) => img.project_id === p.id),
      }));
      return res.json(projects);
    }

    case "POST": {
      const { title } = req.body;
      if (!title) return res.status(400).json({ error: "title es requerido" });
      const maxOrder = await db.execute(
        "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM projects"
      );
      const nextOrder = (maxOrder.rows[0] as any).next_order;
      const result = await db.execute({
        sql: "INSERT INTO projects (title, sort_order) VALUES (?, ?)",
        args: [title, nextOrder],
      });
      return res.status(201).json({
        id: Number(result.lastInsertRowid),
        title,
        sort_order: nextOrder,
        images: [],
      });
    }

    case "PUT": {
      const { id, title, sort_order } = req.body;
      if (!id) return res.status(400).json({ error: "id es requerido" });
      const sets: string[] = [];
      const args: any[] = [];
      if (title !== undefined) { sets.push("title = ?"); args.push(title); }
      if (sort_order !== undefined) { sets.push("sort_order = ?"); args.push(sort_order); }
      if (sets.length > 0) {
        args.push(id);
        await db.execute({ sql: `UPDATE projects SET ${sets.join(", ")} WHERE id = ?`, args });
      }
      return res.json({ success: true });
    }

    case "DELETE": {
      const deleteId = req.query.id || req.body?.id;
      if (!deleteId) return res.status(400).json({ error: "id es requerido" });
      await db.execute({ sql: "DELETE FROM project_images WHERE project_id = ?", args: [Number(deleteId)] });
      await db.execute({ sql: "DELETE FROM projects WHERE id = ?", args: [Number(deleteId)] });
      return res.json({ success: true });
    }

    default:
      res.setHeader("Allow", "GET, POST, PUT, DELETE");
      return res.status(405).json({ error: "Method not allowed" });
  }
}
