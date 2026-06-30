"use client"

import { Perfil, Link } from "@prisma/client";
import LinkMock from "./LinkMock";
import { User } from "lucide-react";

type Props = {
  profile: Perfil | null | undefined;
  links?: Link[]
};

export default function Mock({ profile, links }: Props) {

  return (
    <div className="lg:col-span-2 hidden lg:flex justify-center h-fit sticky top-8">
        <div className="w-[320px] h-[650px] border-[10px] border-charcola rounded-[3rem] bg-gray-50 shadow-2xl relative flex flex-col items-center p-6">
            <div className="absolute top-0 w-32 h-6 bg-charcola rounded-b-3xl z-10"></div>
            
            {/* Previsualización dinámica del Perfil */}
            <div className="mt-8 flex flex-col items-center text-center gap-3 w-full">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden border">
                {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="Preview" className="w-full h-full object-cover" /> : <User size={24} />}
            </div>
            <div>
                <h4 className="font-bold text-gray-800 text-sm">
                {profile?.displayName || "Tu Nombre"}
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                @{profile?.username || "Usuario"}
                </p>
            </div>
            <p className="text-gray-500 text-xs px-4 line-clamp-2 leading-relaxed">
                {profile?.bio || "Tu biografía se verá plasmada aquí en tiempo real."}
            </p>
            </div>
            
            <div className="w-full border-t border-dashed my-5"></div>
            <p className="text-gray-300 text-[11px] uppercase tracking-wider font-bold mb-4">Enlaces</p>

            <div className="w-full flex flex-col gap-3">
                {links?.length ? (
                    links.map((link) => { 
                        return (
                        link.isActive ? (
                            <LinkMock link={link} key={link.id} />
                        ) : null 
                        )
                    }
                )) : (
                    <p className="text-gray-400 text-sm">No hay enlaces disponibles.</p>
                )}
            </div>
        </div>
    </div>  
  )
}
