import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Film,
} from "lucide-react";
import { api } from "../lib/api";
import type { Video } from "../types";

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (urlMatch) return urlMatch[1];
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  return trimmed;
}

function VideoModal({
  video,
  onClose,
  onSave,
}: {
  video: Partial<Video> | null;
  onClose: () => void;
  onSave: (data: { youtube_id: string; title: string }) => void;
}) {
  const [youtubeInput, setYoutubeInput] = useState(video?.youtube_id || "");
  const [title, setTitle] = useState(video?.title || "");
  const isEdit = !!video?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const youtube_id = extractYoutubeId(youtubeInput);
    if (!youtube_id) return;
    onSave({ youtube_id, title });
  };

  const previewId = extractYoutubeId(youtubeInput);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#14141c] border border-white/10 rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-medium">
            {isEdit ? "Editar Video" : "Nuevo Video"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
              URL o ID de YouTube
            </label>
            <input
              type="text"
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors"
              placeholder="https://youtube.com/watch?v=... o ID del video"
              autoFocus
            />
          </div>

          {previewId && /^[\w-]{11}$/.test(previewId) && (
            <div className="aspect-video rounded-lg overflow-hidden bg-white/5">
              <img
                src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
              Titulo (opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors"
              placeholder="Nombre del video"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!youtubeInput.trim()}
              className="px-5 py-2.5 rounded-lg text-sm bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-40 text-white font-medium transition-all"
            >
              {isEdit ? "Guardar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Partial<Video> | null | "new">(null);

  const loadVideos = async () => {
    try {
      const data = await api.get<Video[]>("/api/admin/videos");
      setVideos(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleSave = async (data: { youtube_id: string; title: string }) => {
    if (modal === "new") {
      await api.post("/api/admin/videos", data);
    } else if (modal && typeof modal === "object" && modal.id) {
      await api.put("/api/admin/videos", { id: modal.id, ...data });
    }
    setModal(null);
    await loadVideos();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar este video?")) return;
    await api.delete("/api/admin/videos", id);
    await loadVideos();
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= videos.length) return;
    const a = videos[index];
    const b = videos[swapIndex];
    await Promise.all([
      api.put("/api/admin/videos", { id: a.id, sort_order: b.sort_order }),
      api.put("/api/admin/videos", { id: b.id, sort_order: a.sort_order }),
    ]);
    await loadVideos();
  };

  const filtered = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.youtube_id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light">Videos</h2>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Video
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Film className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <p className="text-xl font-semibold">{videos.length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Videos totales
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors"
          placeholder="Buscar por titulo o ID de YouTube..."
        />
      </div>

      {/* Video list */}
      <div className="space-y-2">
        {filtered.map((video, index) => (
          <div
            key={video.id}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-4 hover:bg-white/[0.07] transition-colors group"
          >
            <img
              src={`https://img.youtube.com/vi/${video.youtube_id}/default.jpg`}
              alt=""
              className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
              referrerPolicy="no-referrer"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {video.title || video.youtube_id}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{video.youtube_id}</p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleMove(index, "up")}
                disabled={index === 0}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                title="Mover arriba"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(index, "down")}
                disabled={index === filtered.length - 1}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                title="Mover abajo"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModal(video)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-brand-orange transition-all"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(video.id)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {search ? "No se encontraron videos" : "No hay videos todavia"}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <VideoModal
          video={modal === "new" ? {} : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
