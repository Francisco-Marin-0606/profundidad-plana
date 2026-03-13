import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Film, Images, ImageIcon, Plus } from "lucide-react";
import { api } from "../lib/api";

interface Stats {
  totalVideos: number;
  totalProjects: number;
  totalImages: number;
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Film;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalVideos: 0,
    totalProjects: 0,
    totalImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [videos, projects] = await Promise.all([
          api.get("/api/admin/videos"),
          api.get("/api/admin/projects"),
        ]);
        const totalImages = projects.reduce(
          (sum: number, p: any) => sum + (p.images?.length || 0),
          0
        );
        setStats({
          totalVideos: videos.length,
          totalProjects: projects.length,
          totalImages,
        });
      } catch {
        // silently fail on load
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <StatCard
          icon={Film}
          value={stats.totalVideos}
          label="Videos"
          color="#a855f7"
        />
        <StatCard
          icon={Images}
          value={stats.totalProjects}
          label="Proyectos"
          color="#FF8C00"
        />
        <StatCard
          icon={ImageIcon}
          value={stats.totalImages}
          label="Imagenes"
          color="#22c55e"
        />
      </div>

      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
        Acciones rapidas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/admin/videos"
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/10 transition-colors group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <Plus className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Agregar Video</p>
            <p className="text-xs text-gray-500">Nuevo video de YouTube</p>
          </div>
        </Link>

        <Link
          to="/admin/proyectos"
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/10 transition-colors group"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
            <Plus className="w-4 h-4 text-brand-orange" />
          </div>
          <div>
            <p className="text-sm font-medium">Agregar Proyecto</p>
            <p className="text-xs text-gray-500">Nuevo proyecto con fotos</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
