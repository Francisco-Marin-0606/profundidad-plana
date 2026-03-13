import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Images,
  ImageIcon,
  ArrowUp,
  ArrowDown,
  Pencil,
} from "lucide-react";
import { api } from "../lib/api";
import type { Project } from "../types";

function NewProjectModal({
  project,
  onClose,
  onSave,
}: {
  project?: Project;
  onClose: () => void;
  onSave: (title: string) => void;
}) {
  const [title, setTitle] = useState(project?.title || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#14141c] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-medium">
            {project ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
              Titulo del proyecto
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors"
              placeholder="Ej: Commercial | Brahma x Trueno"
              autoFocus
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
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-lg text-sm bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-40 text-white font-medium transition-all"
            >
              {project ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddImageInput({
  onAdd,
}: {
  onAdd: (url: string) => void;
}) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAdd(url.trim());
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors"
        placeholder="Pegar URL de imagen..."
      />
      <button
        type="submit"
        disabled={!url.trim()}
        className="px-4 py-2.5 rounded-lg text-sm bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-40 text-white font-medium transition-all flex items-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        Agregar
      </button>
    </form>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState<Project | "new" | null>(null);

  const loadProjects = async () => {
    try {
      const data = await api.get<Project[]>("/api/admin/projects");
      setProjects(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateOrEdit = async (title: string) => {
    if (modal === "new") {
      const created = await api.post("/api/admin/projects", { title });
      setExpanded((prev) => new Set(prev).add(created.id));
    } else if (modal && typeof modal === "object" && modal.id) {
      await api.put("/api/admin/projects", { id: modal.id, title });
    }
    setModal(null);
    await loadProjects();
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Eliminar este proyecto y todas sus imagenes?")) return;
    await api.delete("/api/admin/projects", id);
    await loadProjects();
  };

  const handleAddImage = async (projectId: number, url: string) => {
    await api.post("/api/admin/project-images", {
      project_id: projectId,
      image_url: url,
    });
    await loadProjects();
  };

  const handleDeleteImage = async (imageId: number) => {
    await api.delete("/api/admin/project-images", imageId);
    await loadProjects();
  };

  const handleMoveProject = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= projects.length) return;
    const a = projects[index];
    const b = projects[swapIndex];
    await Promise.all([
      api.put("/api/admin/projects", { id: a.id, sort_order: b.sort_order }),
      api.put("/api/admin/projects", { id: b.id, sort_order: a.sort_order }),
    ]);
    await loadProjects();
  };

  const totalImages = projects.reduce((s, p) => s + (p.images?.length || 0), 0);

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
        <h2 className="text-2xl font-light">Proyectos</h2>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
            <Images className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <p className="text-xl font-semibold">{projects.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Proyectos</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xl font-semibold">{totalImages}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Imagenes totales</p>
          </div>
        </div>
      </div>

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((project, index) => {
          const isOpen = expanded.has(project.id);
          return (
            <div
              key={project.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                onClick={() => toggleExpand(project.id)}
              >
                <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Images className="w-4 h-4 text-brand-orange" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {project.images?.length || 0} imagenes
                  </p>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleMoveProject(index, "up")}
                    disabled={index === 0}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveProject(index, "down")}
                    disabled={index === projects.length - 1}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setModal(project)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-brand-orange transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {/* Expanded images */}
              {isOpen && (
                <div className="px-5 pb-5 border-t border-white/5">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                    {project.images?.map((img) => (
                      <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden bg-white/5">
                        <img
                          src={img.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <AddImageInput onAdd={(url) => handleAddImage(project.id, url)} />
                </div>
              )}
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No hay proyectos todavia
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <NewProjectModal
          project={modal === "new" ? undefined : modal}
          onClose={() => setModal(null)}
          onSave={handleCreateOrEdit}
        />
      )}
    </div>
  );
}
