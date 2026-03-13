import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./lib/auth.tsx";
import "./index.css";

const AdminLayout = lazy(() => import("./admin/AdminLayout.tsx"));
const LoginPage = lazy(() => import("./admin/LoginPage.tsx"));
const DashboardPage = lazy(() => import("./admin/DashboardPage.tsx"));
const VideosPage = lazy(() => import("./admin/VideosPage.tsx"));
const ProjectsPage = lazy(() => import("./admin/ProjectsPage.tsx"));
const SettingsPage = lazy(() => import("./admin/SettingsPage.tsx"));

const AdminLoader = () => (
  <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<AdminLoader />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="videos" element={<VideosPage />} />
              <Route path="proyectos" element={<ProjectsPage />} />
              <Route path="configuracion" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
