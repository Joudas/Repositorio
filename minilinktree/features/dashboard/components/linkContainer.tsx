"use client"
import { Perfil, Link } from "@prisma/client";
import LeftContent from "./Links/LeftContent";
import Mock from "@/components/mock";
import { useState } from "react";


type Props = {
  profile: Perfil | null | undefined;
  getLink: Link[];
  errorMsg: string | null
};

export default function LinkContainer({ profile, getLink, errorMsg }: Props) {
    const [profileData, setProfileData] = useState(profile);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 h-full max-w-6xl mx-auto">

      {/* ÁREA DE GESTIÓN (IZQUIERDA) */}
      <div className="lg:col-span-3">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {errorMsg}
          </div>
        )}
        <LeftContent getLink={getLink} />
      </div>

      {/* CELULAR (DERECHA) */}
      <Mock profile={profileData} links={getLink} />
    </div>
  )
}
