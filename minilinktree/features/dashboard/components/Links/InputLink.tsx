"use client"
import { Link } from "@prisma/client"
import { ImageIcon } from "lucide-react"
import { useRef, useState } from "react"
import Image from "next/image"

export default function InputLink({ link }: { link?: Link }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const existingImage = link?.imageUrl ?? null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (preview) URL.revokeObjectURL(preview)
      setPreview(URL.createObjectURL(file))
    }
  }

  const displayUrl = preview || existingImage

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative min-w-[64px] h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 border-charcola-hover text-charcola-hover transition-colors group overflow-hidden"
      >
        {displayUrl ? (
          <Image src={displayUrl} alt="Preview" fill className="object-cover" />
        ) : (
          <ImageIcon size={24} className="group-hover:scale-110 transition-transform" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        name="image"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex-1 flex flex-col gap-3">
        <input
          type="text"
          defaultValue={link?.title || ""}
          placeholder="Título (ej: Mi GitHub)"
          className="w-full text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 focus:outline-none focus:border-[#117A65] bg-transparent"
          autoFocus
          name="title"
        />
        <input
          type="url"
          defaultValue={link?.url || ""}
          placeholder="URL (ej: https://github.com/...)"
          className="w-full text-sm text-gray-500 border-b-2 border-gray-200 pb-1 focus:outline-none focus:border-[#117A65] bg-transparent"
          name="url"
        />
      </div>
    </div>
  )
}
