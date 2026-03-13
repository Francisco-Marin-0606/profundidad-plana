import { useEffect, useState } from "react";
import { Rocket, Settings, Check, Upload, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import type { SiteSettings } from "../types";

const DEFAULT_SETTINGS: SiteSettings = {
  hero_image: "",
  location: "",
  phone: "",
  email: "",
  instagram_url: "",
  vision_es: "",
  vision_en: "",
  contact_tagline: "",
};

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
      <h3 className="text-sm font-medium text-brand-orange uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
}) {
  const inputClasses =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors";

  return (
    <div>
      <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses} min-h-[120px] resize-y`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen no puede superar 10MB");
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const token = localStorage.getItem("pp_admin_token");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type,
          data: base64,
        }),
      });
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      onChange(result.url);
    } catch {
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 transition-colors"
          placeholder={placeholder}
        />
        <label
          className={`flex items-center gap-1.5 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all flex-shrink-0 ${
            uploading
              ? "bg-white/5 text-gray-500"
              : "bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
          }`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Subiendo..." : "Subir"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 aspect-video max-w-xs rounded-lg overflow-hidden bg-white/5">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<Record<string, string>>("/api/admin/settings");
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/admin/settings", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

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
        <h2 className="text-2xl font-bold">Configuracion</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all ${
            saved
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-brand-orange hover:bg-brand-orange/90 text-white"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Publicado
            </>
          ) : saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publicando...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Pasar a produccion
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-brand-orange" />
        </div>
        <div>
          <p className="text-sm font-medium">Configuracion del sitio</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Estos datos se muestran en la pagina publica
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <SettingsSection title="Hero">
          <ImageField
            label="Imagen de fondo"
            value={settings.hero_image}
            onChange={(v) => update("hero_image", v)}
            placeholder="https://images.unsplash.com/... o subi un archivo"
          />
        </SettingsSection>

        <SettingsSection title="Contacto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Ubicacion"
              value={settings.location}
              onChange={(v) => update("location", v)}
              placeholder="Buenos Aires, Argentina"
            />
            <Field
              label="Telefono"
              value={settings.phone}
              onChange={(v) => update("phone", v)}
              placeholder="+5491169464252"
            />
            <Field
              label="Email"
              value={settings.email}
              onChange={(v) => update("email", v)}
              placeholder="info@profundidadplana.com"
              type="email"
            />
            <Field
              label="URL de Instagram"
              value={settings.instagram_url}
              onChange={(v) => update("instagram_url", v)}
              placeholder="https://instagram.com/profundidadplana"
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Texto de contacto">
          <Field
            label="Frase de contacto"
            value={settings.contact_tagline}
            onChange={(v) => update("contact_tagline", v)}
            placeholder="I'd love to collaborate with some new ideas."
          />
        </SettingsSection>

        <SettingsSection title="Vision">
          <Field
            label="Vision (Español)"
            value={settings.vision_es}
            onChange={(v) => update("vision_es", v)}
            placeholder="Profundidad Plana surge de las imagenes..."
            multiline
          />
          <Field
            label="Vision (English)"
            value={settings.vision_en}
            onChange={(v) => update("vision_en", v)}
            placeholder="Depth Flatness arises from the images..."
            multiline
          />
        </SettingsSection>
      </div>
    </div>
  );
}
