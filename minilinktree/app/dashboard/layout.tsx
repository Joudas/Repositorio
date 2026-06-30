// app/dashboard/layout.tsx
import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";

export const metadata = {
  title: "Mini-Linktree | Dashboard",
  description: "Panel de administración de enlaces",
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  
  return (
    // Un contenedor que ocupa toda la pantalla
    <div className="flex h-screen bg-gray-50">
      
      {/* 1. EL MENÚ LATERAL (SIDEBAR) */}
      {/* Este menú NO se recargará al cambiar de páginas dentro del dashboard */}
      <Sidebar/>

      {/* 2. EL CONTENIDO PRINCIPAL */}
      {/* Aquí es donde se inyectará automáticamente tu archivo app/dashboard/page.tsx */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}