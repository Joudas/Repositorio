import { Link } from "@prisma/client"

export default function InputLink({ link }: 
    { 
        link?: Link
    }) {
  return (
    <>
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
    </>
  )
}
