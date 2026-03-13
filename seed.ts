/**
 * One-time seed script: migrates all existing hardcoded content into Turso.
 *
 * Usage:
 *   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npx tsx seed.ts
 */
import "dotenv/config";
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const VIDEOS = [
  "cym9fuUvRXw", "GdiavfuAoro", "nGewDPG5XfQ", "3jPhs0kMc6U",
  "A8z4u9f_GJE", "vrhCHZFs2IU", "1k6Cdgh41hc", "lwdfnzrOtlA",
  "_bljOsv8hEg", "usdBFoXOV-Y", "NaGjxe1VNw0", "MPTtsYxvjPc",
  "IzpyRjzd-Xc", "zGaIvBFKSxI", "LpM8Aj1pAeg", "pEhuZyfb9ZY",
  "XX8ap6KzVL0", "CoHqDRTkwMw", "DWHWmZJjfBE", "JXTlThbvqsY",
  "fsnAlOBgRzM", "9ZMsNKEo5Lc", "h-471eeALcE", "ne-tZFA0gqs",
  "WOQk6Ea3aZ8", "3lJe6nJohZA", "cMQXnDGWLkI", "rLjlVPgXpMc",
  "X1RoSsl2SvI", "1_kKPxLp6l4", "zzpugWqlx78", "l8RPngcZ044",
  "Brd9ugLdJQ4", "ABFOSaDw5c0", "DDhNnJNK5Ic", "S8o5kI142so",
  "yi3kKp3zsfk", "L2Re1NvY1i8", "9qm6BTphXJY", "fTRwmLsESmg",
  "DpPvWz4RMLU", "JEnjeapOnNk", "RqE6lRR4v40", "21qRrh316fw",
  "pMV95T1nFLg", "VgP3eZ-9M9E", "ZBdoxNg1pRE", "9XIu1jNTfZY",
  "YUAW6TXN6lg", "iPVU864hwUM",
];

const PROJECTS = [
  {
    title: "Commercial | Brahma x Trueno",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.9.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.23.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.51.2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.13.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.39.2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.66.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.28.1-1024x576.jpg",
    ],
  },
  {
    title: "Videoclip | Luana",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_1.1.3-1024x576.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_1.16.1-1024x576.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_1.8.1-1024x576.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_1.116.2-1024x576.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_2.2.1-1024x576.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_2.55.1-1024x576.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_2.62.1-1024x576.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_1.70.1-1024x576.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/LUANA-MASTER-COLOR-STILLS_1.117.3-1024x576.png",
    ],
  },
  {
    title: "Fashion Film | My Saint Mansion",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.2.1-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.1-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.4-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.5-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.6-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.8-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.9-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.10-768x432.png",
    ],
  },
  {
    title: "Videoclip | Papper",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.21-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.22-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.3-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.4-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.6-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.11-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.14-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.13-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/07/Untitled_1.1.9-768x432.jpg",
    ],
  },
  {
    title: "Fashion Film | Bluesheep",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.49.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.50.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.46.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.44.2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.43.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.35.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.32.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.1.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.25.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_2.13.1-1024x576.jpg",
    ],
  },
  {
    title: "Fashion Film | NEGRO",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.26.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.42.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.46.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.45.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.19.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.54.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.97.5.POST_-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.35.1-768x432.jpg",
    ],
  },
  {
    title: "Fashion Film | Levi's 8 mm",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.12.1-1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.15.1-1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.18.2-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.11.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.19.2-1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.21.3-1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.21.2-1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1-768x432.gif",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_3-768x432.gif",
    ],
  },
  {
    title: "Todo encuentra su lugar | Videoclip Ficcion",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.4-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.6-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.7-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.9-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.11-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.14-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.16-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.19-1024x576.jpg",
    ],
  },
  {
    title: "Commercial | Amande",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/06/Hei-5-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Hei-1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Hei-2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/miuk-2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Jap-5-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/miuk-3-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/NY-2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/NY-3-1024x576.jpg",
    ],
  },
];

const SETTINGS = {
  hero_image:
    "https://profundidadplana.com/wp-content/uploads/2025/12/ests.png",
  location: "Buenos Aires, Argentina.",
  phone: "+5491169464252",
  email: "info@profundidadplana.com",
  instagram_url: "https://www.instagram.com/profundidad.plana/",
  vision_es:
    "Profundidad Plana surge de las imágenes que vemos en pantallas, fotografías u otros medios visuales son superficies planas bidimensionales que representan objetos o escenas tridimensionales utilizando técnicas visuales para crear la ilusión de profundidad. Aunque las imágenes pueden parecer tridimensionales, en realidad son representaciones planas de la realidad.",
  vision_en:
    "Depth Flatness arises from the images we see on screens, photographs, or other visual media. They are two-dimensional flat surfaces that represent three-dimensional objects or scenes using visual techniques to create the illusion of depth. Although the images may appear three-dimensional, they are actually flat representations of reality.",
  contact_tagline: "I'd love to collaborate with some new ideas.",
};

async function seed() {
  console.log("Creating tables...");

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      youtube_id TEXT NOT NULL,
      title TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS project_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  console.log(`Inserting ${VIDEOS.length} videos...`);
  const videoBatch = VIDEOS.map((id, i) => ({
    sql: "INSERT INTO videos (youtube_id, title, sort_order) VALUES (?, '', ?)",
    args: [id, i],
  }));
  await db.batch(videoBatch);

  console.log(`Inserting ${PROJECTS.length} projects...`);
  for (let pi = 0; pi < PROJECTS.length; pi++) {
    const project = PROJECTS[pi];
    const result = await db.execute({
      sql: "INSERT INTO projects (title, sort_order) VALUES (?, ?)",
      args: [project.title, pi],
    });
    const projectId = Number(result.lastInsertRowid);

    const imageBatch = project.images.map((url, ii) => ({
      sql: "INSERT INTO project_images (project_id, image_url, sort_order) VALUES (?, ?, ?)",
      args: [projectId, url, ii],
    }));
    await db.batch(imageBatch);
    console.log(`  - "${project.title}": ${project.images.length} images`);
  }

  console.log("Inserting settings...");
  const settingsBatch = Object.entries(SETTINGS).map(([key, value]) => ({
    sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    args: [key, value],
  }));
  await db.batch(settingsBatch);

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
