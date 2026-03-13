import { NavLink, Outlet, Navigate } from "react-router-dom";
import { LayoutDashboard, Film, Images, Settings, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";
import { PublishProvider } from "../lib/publish";
import PublishBar from "./PublishBar";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/videos", icon: Film, label: "Videos", end: false },
  { to: "/admin/proyectos", icon: Images, label: "Proyectos", end: false },
  { to: "/admin/configuracion", icon: Settings, label: "Configuracion", end: false },
];

export default function AdminLayout() {
  const { authenticated, logout } = useAuth();

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <PublishProvider>
      <div className="min-h-screen bg-[#0d0d12] text-white flex">
        <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white/[0.03] border-r border-white/10 flex flex-col z-50">
          <div className="px-6 py-8 border-b border-white/10">
            <h1 className="text-lg font-light tracking-tight">Profundidad Plana</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin</p>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-brand-orange/10 text-brand-orange"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-white/10">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all w-full"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesion
            </button>
          </div>
        </aside>
        <main className="flex-1 ml-60 p-8 pb-24 min-h-screen">
          <Outlet />
        </main>
        <PublishBar />
      </div>
    </PublishProvider>
  );
}
