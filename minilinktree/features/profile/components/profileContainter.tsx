"use client"

import { useState } from "react";
import FormProfile from "./formProfile"
import Mock from "@/components/mock";
import { Perfil, Link } from "@prisma/client";

type Props = {
  profileData: Perfil | null | undefined;
  links: Link[];
};


export default function ProfileContainter({ profileData, links }: Props) {
    const [profile, setProfile] = useState(profileData);

    const handleProfile = (profileData: Perfil | null | undefined) => {
      setProfile(profileData)
    }

  return (
    <>
        {/* SECCIÓN DE EDICIÓN (IZQUIERDA) */}
        <FormProfile profile={profile} onProfileUpdate={setProfile} handleProfile={handleProfile} />

        {/* MOCK DEL TELÉFONO (DERECHA) - Para mantener consistencia con los links */}
        <Mock profile={profile} links={links} />
    </>
  )
}
