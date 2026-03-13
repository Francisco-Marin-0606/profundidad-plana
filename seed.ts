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
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop",
    ],
  },
  {
    title: "Videoclip | Luana",
    images: [
      "https://images.unsplash.com/photo-1514525253344-f814d074358a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253344-f814d074358a?q=80&w=1000&auto=format&fit=crop",
    ],
  },
  {
    title: "Todo encuentra su lugar | Videoclip Ficcion",
    images: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
    ],
  },
  {
    title: "Commercial | Amande",
    images: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684847-75bdda21cc95?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684847-75bdda21cc95?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=1000&auto=format&fit=crop",
    ],
  },
];

const SETTINGS = {
  hero_image:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop",
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
