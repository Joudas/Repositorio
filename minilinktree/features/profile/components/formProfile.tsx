"use client"

import { Perfil } from "@prisma/client";
import { FileText, Link2, Loader2, Sparkles, User } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { showToast } from "nextjs-toast-notify";
import { UpdateProfileAction } from "../actions/ProfileAction";
import Image from "next/image"
import { compressImage } from "@/utils/compressImage";
import { UploadImageAction } from "@/features/dashboard/actions/ImageAction";

type Props = {
  profile: Perfil | null | undefined;
  onProfileUpdate: (profile: Perfil | null | undefined) => void;
  handleProfile: (profileData: Perfil | null | undefined) => void
};

export default function FormProfile({ profile, onProfileUpdate, handleProfile }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const existingAvatar = profile?.avatarUrl ?? null;
  const displayUrl = preview || existingAvatar;
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (preview) URL.revokeObjectURL(preview)
      setPreview(URL.createObjectURL(file))
    }
  }
  

  const handleUpdateProfile = async (prevState: any, formData: FormData) => {
    const displayName = formData.get("displayName") as string;
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    const imageFile = formData.get("avatar") as File | null;
    let avatarUrl: string | undefined = profile?.avatarUrl ?? undefined;


    // Llamamos a tu Server Action (que actualizará Prisma y Neon DB)
    if (imageFile && imageFile.size > 0) {
      const compressed = await compressImage(imageFile);
      const uploadFormData = new FormData();
      uploadFormData.append("image", compressed);
      const uploadResult = await UploadImageAction(uploadFormData, "avatar");
      if (uploadResult.success) {
        avatarUrl = uploadResult.imageUrl ?? undefined;
      } else {
        return { error: uploadResult.error };
      }
    }

    const body = { displayName, username, bio, avatarUrl };
    
    const response = await UpdateProfileAction(body);

    if (response.success) {
      onProfileUpdate(response?.data);
      showToast.success(
        "El perfil se ha actualizado con éxito!",
        {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
          progress: true,
        }
      );
      
      return { error: null };
    }

    showToast.error(
        "Error al actualizar el perfil",
        {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
          progress: true,
        }
      );

    return { error: "Ocurrió un error inesperado" };
  };

  const handleDiscart = () => {
    handleProfile(profile);
  }

  const [state, formAction, isPending] = useActionState(handleUpdateProfile, { error: "" });

  return (
    <form 
        action={formAction}
        className="lg:col-span-3 flex flex-col gap-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Perfil Público
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Personaliza cómo te verán tus seguidores en tu página biográfica.
          </p>
        </div>

        {/* Zona del Avatar (Foto de Perfil) */}
        <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
          {/* <div className="w-20 h-25 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 relative group overflow-hidden">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={28} />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white text-xs font-medium">Cambiar</span>
            </div> */}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-25 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 relative group overflow-hidden"
            >
              {displayUrl ? (
                <Image src={displayUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <User size={28} />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-medium">Cambiar</span>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              name="avatar"
              onChange={handleFileSelect}
              className="hidden"
            />

          {/* </div> */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Imagen de Perfil</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-[240px]">
              Se recomienda una imagen cuadrada en formato PNG o JPG de máximo 2MB.
            </p>
          </div>
        </div>

        {/* Inputs del Formulario */}
        <div className="flex flex-col gap-5">
          
          {/* Nombre a Mostrar */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <User size={16} className="text-gray-400" />
              Nombre público
            </label>
            <input 
              type="text"
              name="displayName"
              defaultValue={profile?.displayName || ""}
              placeholder="Ej. Juan Das"
              disabled={isPending}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-charcola focus:bg-white transition-all disabled:opacity-50 text-sm"
            />
          </div>

          {/* Enlace personalizado (Username) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Link2 size={16} className="text-gray-400" />
              Nombre de usuario (URL única)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 text-sm font-medium select-none">
                minilink.com/
              </span>
              <input 
                type="text"
                name="username"
                defaultValue={profile?.username || ""}
                placeholder="tu-nombre"
                disabled={isPending}
                className="w-full pl-[112px] pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-charcola placeholder-gray-400 focus:outline-none focus:border-charcola focus:bg-white transition-all disabled:opacity-50 text-sm"
              />
            </div>
          </div>

          {/* Biografía Corta */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <FileText size={16} className="text-gray-400" />
              Biografía
            </label>
            <textarea 
              name="bio"
              rows={3}
              defaultValue={profile?.bio || ""}
              placeholder="Cuéntale al mundo quién eres..."
              disabled={isPending}
              maxLength={160}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-charcola focus:bg-white transition-all disabled:opacity-50 text-sm resize-none"
            />
            <p className="text-right text-xs text-gray-400">Máximo 160 caracteres</p>
          </div>
        </div>

        {/* Zona Inferior: Estado de Error y Botones */}
        <div className="border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {state?.error && (
              <p className="text-xs text-red-500 font-semibold">{state.error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={handleDiscart}
              disabled={isPending}
              className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Descartar
            </button>
            
            {/* 🚀 BOTÓN PRINCIPAL CON BG-CHARCOLA Y ANIMACIÓN SPINNER */}
            <button 
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-sm font-medium bg-charcola hover:bg-charcola-hover text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm font-medium cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Guardar Perfil
                </>
              )}
            </button>
          </div>
        </div>
      </form>
  )
}
