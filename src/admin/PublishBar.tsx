import { Rocket, Loader2, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { usePublish } from "../lib/publish";

export default function PublishBar() {
  const { isDirty, publish, publishing } = usePublish();
  const [done, setDone] = useState(false);

  const handle = async () => {
    try {
      await publish();
      setDone(true);
      setTimeout(() => setDone(false), 5000);
    } catch {
      alert("Error al publicar los cambios");
    }
  };

  if (!isDirty && !done) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      {done ? (
        <div className="flex items-center gap-4 bg-green-950/90 border border-green-500/30 rounded-2xl px-6 py-4 shadow-2xl shadow-green-900/30 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-300">Cambios publicados exitosamente</p>
            <p className="text-xs text-green-400/70 mt-0.5">Los cambios ya estan visibles en la pagina publica</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 border border-green-500/30 rounded-lg px-3 py-2 hover:bg-green-500/10 transition-all ml-2"
          >
            Ver sitio <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <div className="flex items-center gap-4 bg-[#1a1a2e] border border-white/10 rounded-2xl px-6 py-3.5 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm text-gray-300">Tienes cambios sin publicar</span>
          <button
            onClick={handle}
            disabled={publishing}
            className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-70 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            {publishing ? "Publicando..." : "Pasar a producción"}
          </button>
        </div>
      )}
    </div>
  );
}
