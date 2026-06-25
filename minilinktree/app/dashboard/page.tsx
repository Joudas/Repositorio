import { GetLinkAction } from "@/features/dashboard/actions/LinkAction";
import LeftContent from "@/features/dashboard/components/Links/LeftContent";

export default async function DashboardPage() {
  const getLinkAction = await GetLinkAction();
  const getLink = Array.isArray(getLinkAction?.data) ? getLinkAction.data : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 h-full max-w-6xl mx-auto">
      
      {/* ÁREA DE GESTIÓN (IZQUIERDA) */}
      <LeftContent getLink={getLink} />

      {/* CELULAR (DERECHA) */}
      <div className="lg:col-span-2 hidden lg:flex justify-center h-fit sticky top-8">
        <div className="w-[320px] h-[650px] border-[10px] border-gray-900 rounded-[3rem] bg-gray-50 shadow-2xl relative flex flex-col items-center justify-center">
          <div className="absolute top-0 w-32 h-6 bg-gray-900 rounded-b-3xl"></div>
          <p className="text-gray-400 text-sm">Vista previa aquí</p>
        </div>
      </div>

    </div>
  );
}