import React from 'react'

export default function ListLinks({ link }: { link?: any }) {
  return (
    <input 
        type="text" 
        defaultValue={link?.title || ""} 
        placeholder="Título (ej: Mi GitHub)" 
        className="w-full text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 focus:outline-none focus:border-[#117A65] bg-transparent"
        autoFocus
        name="title"
    />
  )
}
