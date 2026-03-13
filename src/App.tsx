import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { motion } from "motion/react";
import {
  ExternalLink,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { SiteContent } from "./types";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let ytApiLoaded = false;
let ytApiLoading = false;
const ytApiCallbacks: (() => void)[] = [];

function loadYouTubeAPI(): Promise<void> {
  if (ytApiLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    ytApiCallbacks.push(resolve);
    if (ytApiLoading) return;
    ytApiLoading = true;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => {
      ytApiLoaded = true;
      ytApiCallbacks.forEach((cb) => cb());
      ytApiCallbacks.length = 0;
    };
  });
}

type PlayerRegistry = {
  register: (id: string, player: any) => void;
  unregister: (id: string) => void;
  pauseAllExcept: (id: string) => void;
};

const PlayerRegistryContext = createContext<PlayerRegistry>({
  register: () => {},
  unregister: () => {},
  pauseAllExcept: () => {},
});

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

const FALLBACK_VIDEOS = [
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
].map((id, i) => ({ id: i, youtube_id: id, title: "", sort_order: i }));

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
    <h2 className="text-brand-orange text-[21px] md:text-[38px] font-light tracking-[-2px] uppercase" style={{ wordSpacing: '8px' }}>
      {title}
    </h2>
  </div>
);

const VideoSkeleton = () => (
  <div className="absolute inset-0 bg-[#0f0f0f] overflow-hidden">
    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[72px] h-[50px] bg-white/[0.08] rounded-2xl flex items-center justify-center backdrop-blur-sm">
        <div className="w-0 h-0 border-l-[16px] border-l-white/20 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
      </div>
    </div>
  </div>
);

const VideoEmbed = ({
  videoId,
  canLoad,
  onReady,
}: {
  videoId: string;
  canLoad: boolean;
  onReady: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const registry = useContext(PlayerRegistryContext);
  const uniqueId = useRef(`yt-player-${videoId}-${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const vis = entry.isIntersecting;
        setIsVisible(vis);
        if (vis) setDismissed(false);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canLoad || playerRef.current) return;

    loadYouTubeAPI().then(() => {
      if (!containerRef.current || playerRef.current) return;

      const div = document.createElement("div");
      div.id = uniqueId.current;
      containerRef.current.appendChild(div);

      playerRef.current = new window.YT.Player(uniqueId.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            setIsLoaded(true);
            registry.register(uniqueId.current, playerRef.current);
            onReady();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              registry.pauseAllExcept(uniqueId.current);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          },
        },
      });
    });

    return () => {
      registry.unregister(uniqueId.current);
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [canLoad, videoId, registry, onReady]);

  const showMiniPlayer = isPlaying && !isVisible && isLoaded && !dismissed;

  const handleMiniPlayerClick = useCallback(() => {
    setDismissed(true);
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    try { playerRef.current?.pauseVideo(); } catch {}
  }, []);

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div
          ref={wrapperRef}
          className="relative aspect-video w-full overflow-hidden rounded-sm shadow-2xl bg-black"
        >
          {!isLoaded && <VideoSkeleton />}
          {showMiniPlayer && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[72px] h-[50px] bg-white/[0.06] rounded-2xl flex items-center justify-center">
                <div className="w-0 h-0 border-l-[16px] border-l-white/15 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
              </div>
            </div>
          )}
          <div
            ref={containerRef}
            className={
              showMiniPlayer
                ? "fixed bottom-5 right-5 w-[280px] sm:w-[320px] aspect-video z-[9999] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 animate-mini-in"
                : `absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`
            }
          />
        </div>
      </div>
      {showMiniPlayer && (
        <div className="fixed bottom-5 right-5 w-[280px] sm:w-[320px] aspect-video z-[10000] rounded-lg overflow-hidden animate-mini-in">
          <div
            onClick={handleMiniPlayerClick}
            className="absolute inset-0 cursor-pointer"
          />
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/90 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold transition-colors backdrop-blur-sm"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

const VideoSection = ({ videos }: { videos: { id: number; youtube_id: string }[] }) => {
  const [readyCount, setReadyCount] = useState(0);
  const advance = useCallback(() => setReadyCount((c) => c + 1), []);
  const playersRef = useRef<Map<string, any>>(new Map());

  const registry: PlayerRegistry = useRef<PlayerRegistry>({
    register: (id, player) => {
      playersRef.current.set(id, player);
    },
    unregister: (id) => {
      playersRef.current.delete(id);
    },
    pauseAllExcept: (id) => {
      playersRef.current.forEach((player, key) => {
        if (key !== id) {
          try {
            player.pauseVideo();
          } catch {}
        }
      });
    },
  }).current;

  return (
    <PlayerRegistryContext.Provider value={registry}>
      <section id="work">
        <SectionHeader title="Featured Work" />
        {videos.map((v, i) => (
          <VideoEmbed
            key={v.id}
            videoId={v.youtube_id}
            canLoad={i <= readyCount}
            onReady={advance}
          />
        ))}
      </section>
    </PlayerRegistryContext.Provider>
  );
};

const StillsCarousel = ({
  title,
  images,
}: {
  title: string;
  images: { image_url: string }[];
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const firstChild = container.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const itemWidth = firstChild.offsetWidth + 4;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (direction === "right" && container.scrollLeft >= maxScroll - 2) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({
        left: direction === "left" ? -itemWidth : itemWidth,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => scroll("right"), 5000);
    return () => clearInterval(id);
  }, [scroll]);

  return (
    <div className="pb-10">
      <div className="h-[40px] flex items-center justify-center mb-4">
        <p className="text-center text-white font-light text-[22px] md:text-[24px] leading-tight">{title}</p>
      </div>
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
        if (!data.videos || data.videos.length === 0) {
          data.videos = FALLBACK_VIDEOS;
        }
        setContent(data);
      })
      .catch(() => {
        setContent({
          videos: FALLBACK_VIDEOS,
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
          <VideoSection videos={content.videos} />
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
        <footer className="bg-[#f5f5f5] py-12 flex justify-center">
          <a
            href={s.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black hover:scale-110 transition-all"
          >
            <Instagram className="w-8 h-8" />
          </a>
        </footer>
      </div>
    </div>
  );
}
