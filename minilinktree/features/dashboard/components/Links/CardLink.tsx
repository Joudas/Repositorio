import { Link } from '@prisma/client';
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react';

type Props ={
    link: Link,
    toggleLinkStatus: (id: Link["id"]) => void,
    deleteLink: (id: Link["id"]) => void,
    setEditingId: Dispatch<SetStateAction<Link["id"] | null>>
}

export default function CardLink({ link, toggleLinkStatus, deleteLink, setEditingId }: Props) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group ${!link.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
                
        <div className="text-gray-300 cursor-grab hover:text-gray-600">
        <GripVertical size={20} />
        </div>
        
        <div className="flex-1 overflow-hidden">
        <h3 className={`font-semibold text-base ${!link.isActive ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
            {link.title}
        </h3>
        <p className="text-gray-500 text-sm truncate">{link.url}</p>
        </div>

        {/* CONTROLES DE LA DERECHA */}
        <div className="flex items-center gap-3">
        
        {/* Toggle Switch (Tailwind CSS puro) */}
        <button 
            onClick={() => toggleLinkStatus(link.id)}
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${link.isActive ? 'bg-charcola' : 'bg-gray-300'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${link.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>

        {/* Contenedor de Editar / Borrar */}
        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity border-l pl-3 ml-1">
            <button onClick={() => setEditingId(link.id)} className="cursor-pointer p-2 text-gray-500 hover:bg-gray-100 hover:text-[#117A65] rounded-md transition-colors">
            <Pencil size={18} />
            </button>
            <button onClick={() => deleteLink(link.id)} className="cursor-pointer p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors">
            <Trash2 size={18} />
            </button>
        </div>

        </div>
    </div>
  )
}
