// app/dashboard/layout.tsx
import ButtonSignOut from "@/components/buttonSignOut";
import NavLink from "@/features/dashboard/components/Links/NavLink";
import Image from "next/image";
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
      <aside className="w-64 bg-basic border p-4 m-2 aside rounded-md flex flex-col justify-between">
        <nav className="flex flex-col gap-2">
          <div className="grid justify-center">
            <Image src="/mini_tree.webp" alt="Logo" width={100} height={50} />
            <h2 className="text-xl font-bold mb-6 text-charcola ">Mini-Linktree</h2>
          </div>
          <NavLink />
        </nav>
          <ButtonSignOut />

      </aside>

      {/* 2. EL CONTENIDO PRINCIPAL */}
      {/* Aquí es donde se inyectará automáticamente tu archivo app/dashboard/page.tsx */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}