export interface Video {
  id: number;
  youtube_id: string;
  title: string;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  sort_order: number;
  created_at: string;
  images: ProjectImage[];
}

export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  sort_order: number;
}

export interface SiteSettings {
  hero_image: string;
  location: string;
  phone: string;
  email: string;
  instagram_url: string;
  vision_es: string;
  vision_en: string;
  contact_tagline: string;
}

export interface SiteContent {
  videos: Video[];
  projects: Project[];
  settings: SiteSettings;
}
