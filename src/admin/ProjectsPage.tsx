import { useEffect, useState, useRef, useCallback } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Images,
  ImageIcon,
  Pencil,
  Upload,
  Link,
  Loader2,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "../lib/api";
import type { Project, ProjectImage } from "../types";
import PublishBar from "./PublishBar";

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
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!title.trim()) return; onSave(title.trim()); };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#14141c] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-medium">{project ? "Editar Proyecto" : "Nuevo Proyecto"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Titulo del proyecto</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Ej: Commercial | Brahma x Trueno" autoFocus />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancelar</button>
            <button type="submit" disabled={!title.trim()} className="px-5 py-2.5 rounded-lg text-sm bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-40 text-white font-medium transition-all">{project ? "Guardar" : "Crear"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddImageInput({ onAdd }: { onAdd: (url: string) => void }) {
  const [mode, setMode] = useState<"url" | "file">("file");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUrlSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!url.trim()) return; onAdd(url.trim()); setUrl(""); };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { alert("Solo se permiten archivos de imagen"); return; }
    if (file.size > 10 * 1024 * 1024) { alert("La imagen no puede superar 10MB"); return; }
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const token = localStorage.getItem("pp_admin_token");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, content_type: file.type, data: base64 }),
      });
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      onAdd(result.url);
    } catch { alert("Error al subir la imagen"); } finally { setUploading(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) uploadFile(file); e.target.value = ""; };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) uploadFile(file); };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 w-fit">
        <button type="button" onClick={() => setMode("url")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "url" ? "bg-brand-orange/20 text-brand-orange" : "text-gray-400 hover:text-white"}`}>
          <Link className="w-3 h-3" />URL
        </button>
        <button type="button" onClick={() => setMode("file")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "file" ? "bg-brand-orange/20 text-brand-orange" : "text-gray-400 hover:text-white"}`}>
          <Upload className="w-3 h-3" />Archivo
        </button>
      </div>
      {mode === "url" ? (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Pegar URL de imagen..." />
          <button type="submit" disabled={!url.trim()} className="px-4 py-2.5 rounded-lg text-sm bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-40 text-white font-medium transition-all flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" />Agregar</button>
        </form>
      ) : (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragOver ? "border-brand-orange bg-brand-orange/5" : "border-white/10 hover:border-white/20"} ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /><p className="text-sm text-gray-400">Subiendo imagen...</p></div>
          ) : (
            <>
              <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Arrastra una imagen aqui o</p>
              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-brand-orange hover:bg-brand-orange/90 text-white font-medium cursor-pointer transition-all">
                <Plus className="w-3.5 h-3.5" />Elegir archivo
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
              <p className="text-xs text-gray-600 mt-2">JPG, PNG, WebP -- max 10MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SortableImageItem({ img, onDelete }: { img: ProjectImage; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined, opacity: isDragging ? 0.7 : 1 };
  return (
    <div ref={setNodeRef} style={style} className={`relative group aspect-video rounded-lg overflow-hidden bg-white/5 ${isDragging ? "ring-2 ring-brand-orange/50" : ""}`}>
      <div {...attributes} {...listeners} className="absolute top-2 left-2 p-1 rounded bg-black/60 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10 touch-none">
        <GripVertical className="w-3.5 h-3.5" />
      </div>
      <img src={img.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      <button onClick={onDelete} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-10">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function SortableProjectItem({
  project,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onAddImage,
  onDeleteImage,
  onReorderImages,
}: {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddImage: (url: string) => void;
  onDeleteImage: (id: number) => void;
  onReorderImages: (images: ProjectImage[]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined, opacity: isDragging ? 0.8 : 1 };
  const imageSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleImageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !project.images) return;
    const oldIdx = project.images.findIndex((i) => i.id === active.id);
    const newIdx = project.images.findIndex((i) => i.id === over.id);
    onReorderImages(arrayMove(project.images, oldIdx, newIdx));
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden ${isDragging ? "shadow-2xl shadow-brand-orange/10 ring-1 ring-brand-orange/30" : ""}`}>
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors" onClick={onToggle}>
        <button {...attributes} {...listeners} onClick={(e) => e.stopPropagation()} className="cursor-grab active:cursor-grabbing p-1 text-gray-600 hover:text-gray-300 transition-colors touch-none">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
          <Images className="w-4 h-4 text-brand-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{project.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{project.images?.length || 0} imagenes</p>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEdit} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-brand-orange transition-all"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </div>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-white/5">
          {project.images && project.images.length > 0 && (
            <DndContext sensors={imageSensors} collisionDetection={closestCenter} onDragEnd={handleImageDragEnd}>
              <SortableContext items={project.images.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                  {project.images.map((img) => (
                    <SortableImageItem key={img.id} img={img} onDelete={() => onDeleteImage(img.id)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
          <AddImageInput onAdd={onAddImage} />
        </div>
      )}
    </div>
  );
}

function serializeOrder(projects: Project[]): string {
  return projects
    .map((p) => `${p.id}:${(p.images || []).map((i) => i.id).join(",")}`)
    .join("|");
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState<Project | "new" | null>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const savedOrderRef = useRef("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const loadProjects = async () => {
    try {
      const data = await api.get<Project[]>("/api/admin/projects");
      setProjects(data);
      savedOrderRef.current = serializeOrder(data);
      setOrderChanged(false);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadProjects(); }, []);

  const checkOrderChanged = useCallback((ps: Project[]) => {
    setOrderChanged(serializeOrder(ps) !== savedOrderRef.current);
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
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
    await api.post("/api/admin/project-images", { project_id: projectId, image_url: url });
    await loadProjects();
  };

  const handleDeleteImage = async (imageId: number) => {
    await api.delete("/api/admin/project-images", imageId);
    await loadProjects();
  };

  const handleProjectDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);
    checkOrderChanged(reordered);
  };

  const handleImageReorder = (projectId: number, images: ProjectImage[]) => {
    const updated = projects.map((p) => (p.id === projectId ? { ...p, images } : p));
    setProjects(updated);
    checkOrderChanged(updated);
  };

  const handlePublish = async () => {
    const calls: Promise<any>[] = [];
    projects.forEach((p, pi) => {
      calls.push(api.put("/api/admin/projects", { id: p.id, sort_order: pi }));
      p.images?.forEach((img, ii) => {
        calls.push(api.put("/api/admin/project-images", { id: img.id, sort_order: ii }));
      });
    });
    await Promise.all(calls);
    savedOrderRef.current = serializeOrder(projects);
    setOrderChanged(false);
  };

  const totalImages = projects.reduce((s, p) => s + (p.images?.length || 0), 0);

  if (loading) {
    return (<div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /></div>);
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Proyectos</h2>
        <button onClick={() => setModal("new")} className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all">
          <Plus className="w-4 h-4" />Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center"><Images className="w-5 h-5 text-brand-orange" /></div>
          <div><p className="text-xl font-semibold">{projects.length}</p><p className="text-xs text-gray-500 uppercase tracking-wider">Proyectos</p></div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-green-400" /></div>
          <div><p className="text-xl font-semibold">{totalImages}</p><p className="text-xs text-gray-500 uppercase tracking-wider">Imagenes totales</p></div>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjectDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {projects.map((project) => (
              <SortableProjectItem
                key={project.id}
                project={project}
                isOpen={expanded.has(project.id)}
                onToggle={() => toggleExpand(project.id)}
                onEdit={() => setModal(project)}
                onDelete={() => handleDeleteProject(project.id)}
                onAddImage={(url) => handleAddImage(project.id, url)}
                onDeleteImage={handleDeleteImage}
                onReorderImages={(imgs) => handleImageReorder(project.id, imgs)}
              />
            ))}
            {projects.length === 0 && (<div className="text-center py-16 text-gray-500">No hay proyectos todavia</div>)}
          </div>
        </SortableContext>
      </DndContext>

      {modal !== null && (
        <NewProjectModal project={modal === "new" ? undefined : modal} onClose={() => setModal(null)} onSave={handleCreateOrEdit} />
      )}

      <PublishBar visible={orderChanged} onPublish={handlePublish} />
    </div>
  );
}
