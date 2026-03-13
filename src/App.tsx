import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ExternalLink,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { SiteContent } from "./types";

const DEFAULT_SETTINGS = {
  hero_image: "/hero-bg.png",
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

const FALLBACK_PROJECTS = [
  {
    id: 1, title: "Commercial | Brahma x Trueno", sort_order: 1, created_at: "",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.9.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.23.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.51.2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.13.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.39.2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.66.1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Untitled_1.28.1-1024x576.jpg",
    ].map((url, i) => ({ id: i, project_id: 1, image_url: url, sort_order: i })),
  },
  {
    id: 2, title: "Videoclip | Luana", sort_order: 2, created_at: "",
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
    ].map((url, i) => ({ id: i, project_id: 2, image_url: url, sort_order: i })),
  },
  {
    id: 3, title: "Fashion Film | My Saint Mansion", sort_order: 3, created_at: "",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.2.1-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.1-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.4-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.5-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.6-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.8-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.9-768x432.png",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.3.10-768x432.png",
    ].map((url, i) => ({ id: i, project_id: 3, image_url: url, sort_order: i })),
  },
  {
    id: 4, title: "Videoclip | Papper", sort_order: 4, created_at: "",
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
    ].map((url, i) => ({ id: i, project_id: 4, image_url: url, sort_order: i })),
  },
  {
    id: 5, title: "Fashion Film | Bluesheep", sort_order: 5, created_at: "",
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
    ].map((url, i) => ({ id: i, project_id: 5, image_url: url, sort_order: i })),
  },
  {
    id: 6, title: "Fashion Film | NEGRO", sort_order: 6, created_at: "",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.26.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.42.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.46.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.45.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.19.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.54.1-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.97.5.POST_-768x432.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/1_1.35.1-768x432.jpg",
    ].map((url, i) => ({ id: i, project_id: 6, image_url: url, sort_order: i })),
  },
  {
    id: 7, title: "Fashion Film | Levi's 8 mm", sort_order: 7, created_at: "",
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
    ].map((url, i) => ({ id: i, project_id: 7, image_url: url, sort_order: i })),
  },
  {
    id: 8, title: "Todo encuentra su lugar | Videoclip Ficcion", sort_order: 8, created_at: "",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.4-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.6-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.7-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.9-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.11-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.14-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.16-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/08/Untitled_1.1.19-1024x576.jpg",
    ].map((url, i) => ({ id: i, project_id: 8, image_url: url, sort_order: i })),
  },
  {
    id: 9, title: "Commercial | Amande", sort_order: 9, created_at: "",
    images: [
      "https://profundidadplana.com/wp-content/uploads/2023/06/Hei-5-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Hei-1-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Hei-2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/miuk-2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/Jap-5-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/miuk-3-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/NY-2-1024x576.jpg",
      "https://profundidadplana.com/wp-content/uploads/2023/06/NY-3-1024x576.jpg",
    ].map((url, i) => ({ id: i, project_id: 9, image_url: url, sort_order: i })),
  },
];

const SectionHeader = ({ title }: { title: string }) => (
  <div className="py-16 text-center">
    <h2 className="text-brand-orange text-[21px] md:text-[38px] font-light tracking-[10px] uppercase" style={{ wordSpacing: '8px' }}>
      {title}
    </h2>
  </div>
);

const VideoEmbed = ({ videoId }: { videoId: string }) => (
  <div className="max-w-5xl mx-auto px-4 mb-12">
    <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        className="absolute top-0 left-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
);

const StillsCarousel = ({
  title,
  images,
}: {
  title: string;
  images: { image_url: string }[];
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const firstChild = container.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const itemWidth = firstChild.offsetWidth + 4;
    container.scrollBy({
      left: direction === "left" ? -itemWidth : itemWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-20">
      <p className="text-center text-white font-light text-[22px] md:text-[24px] mb-8">{title}</p>
      <div className="relative group">
        <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide gap-1 px-4 md:px-0">
          {images.map((img, i) => (
            <div key={i} className="flex-none w-full md:w-1/3 aspect-video">
              <img
                src={img.image_url}
                alt={`${title} still ${i}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="text-white" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
    </div>
  );
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Cargando
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (!data.projects || data.projects.length === 0) {
          data.projects = FALLBACK_PROJECTS;
        }
        setContent(data);
      })
      .catch(() => {
        setContent({
          videos: [],
          projects: FALLBACK_PROJECTS,
          settings: DEFAULT_SETTINGS as any,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) return <LoadingSkeleton />;

  const s = { ...DEFAULT_SETTINGS, ...content.settings };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-orange/30 font-sans">
      {/* Fixed Hero Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={s.hero_image}
          alt="Cinematic Background"
          className="w-full h-full object-cover object-top"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 hero-bg-overlay" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 h-screen w-full flex flex-col items-center justify-end px-6 md:px-10 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-[32px] md:text-[111px] font-extralight leading-tight mb-4 md:mb-6 hero-title-shadow">
            Profundidad Plana
          </h1>
          <h2 className="text-[18px] md:text-[24px] font-normal mb-2 md:mb-4 hero-subtitle-shadow">
            Film Director | Cinematographer
          </h2>
          <h2 className="text-[18px] md:text-[24px] font-normal mb-6 md:mb-8">
            Worldwide
          </h2>
          <h3 className="text-[24px] md:text-[32px] font-normal flex justify-center gap-4">
            <span>🇦🇷</span>
            <span>🇲🇽</span>
            <span>🇪🇸</span>
            <span>🇺🇸</span>
          </h3>
        </motion.div>
      </section>

      {/* Content that scrolls over the fixed background */}
      <div className="relative z-10 bg-black">
        {/* Featured Work */}
        {content.videos.length > 0 && (
          <section id="work">
            <SectionHeader title="Featured Work" />
            {content.videos.map((v: any) => (
              <VideoEmbed key={v.id} videoId={v.youtube_id} />
            ))}
          </section>
        )}

        {/* Stills & Projects */}
        {content.projects.length > 0 && (
          <section id="stills">
            <SectionHeader title="Stills & Projects" />
            {content.projects.map((p: any) => (
              <StillsCarousel key={p.id} title={p.title} images={p.images} />
            ))}
          </section>
        )}

        {/* Vision Section */}
        <section id="vision" className="px-5 md:px-[120px] py-20">
          <SectionHeader title="Vision" />
          <div
            className="text-[18px] font-light text-white text-justify md:columns-2 md:gap-12"
            style={{ lineHeight: '41px', letterSpacing: '-1px', wordSpacing: '3px' }}
          >
            <p className="mb-6 md:mb-0">{s.vision_es}</p>
            <p>{s.vision_en}</p>
          </div>
        </section>

        {/* Get In Touch */}
        <section id="contact" className="py-20 bg-black">
          <SectionHeader title="Get In Touch" />
          <div className="text-center px-5 md:px-6">
            <h1 className="text-[18px] md:text-[21px] font-light mb-12 text-white">
              {s.contact_tagline}
            </h1>

            <div className="space-y-4 max-w-md mx-auto">
              <h1 className="text-[18px] md:text-[24px] font-light text-white">
                📍 {s.location}
              </h1>
              <h1 className="text-[18px] md:text-[24px] font-light text-white">
                📞 {s.phone}
              </h1>
            </div>

            <div className="mt-6">
              <a
                href={`mailto:${s.email}`}
                className="text-[18px] md:text-[24px] font-light text-white hover:opacity-80 transition-opacity lowercase"
              >
                {s.email}
              </a>
            </div>

            <div className="mt-12">
              <a
                href={s.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-6 text-[18px] md:text-[17px] font-normal tracking-[3.8px] text-white hover:opacity-80 transition-opacity"
              >
                Visit my Instagram for much more content
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 py-12 flex justify-center">
          <a
            href={s.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:scale-110 transition-transform"
          >
            <Instagram className="w-8 h-8" />
          </a>
        </footer>
      </div>
    </div>
  );
}
