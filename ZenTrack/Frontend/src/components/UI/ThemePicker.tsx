import type { Theme } from '@/type/Theme'
import React from 'react'

import { FaCheck } from "react-icons/fa";

type Props = {
  themes: Theme[];
  onSelect: React.Dispatch<React.SetStateAction<string>>;
  selectedId: string
}

export function ThemePicker({themes, selectedId, onSelect}: Props) {
  return (
    <div className="w-full max-w-xs p-2 rounded-lg">
      <p className="text-xs font-semibold text-gray-3 mb-3">Color de fondo</p>

      {/* Grid de 3 columnas */}
      <div className="grid grid-cols-3 gap-2">
        {themes.map((th) => {
          const isSelected = selectedId === th.id;
          const style = th.mode == "COLOR" ? {backgroundImage: `linear-gradient(to bottom right, ${th.color_one}, ${th.color_two})`}
          : th.mode == "IMAGE" && { backgroundImage: `url(/${th.image}.jpg)`, backgroundSize: "cover" as const, backgroundPosition: "center" as const } 
          
          return (
            <button
              key={th.id}
              type="button"
              onClick={() => onSelect(th.id)}
              className={`relative h-12 w-full rounded-md overflow-hidden transition-all duration-200 focus:outline-none hover:scale-105 
                ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-5' : 'opacity-90 hover:opacity-100'}
                `}
                style={style}
            >
              {/* Contenedor del degradado / split de dos colores */}
              <div className="flex h-full w-full">
                <div className={`w-1/2 h-full ${th.color_one}`} />
                <div className={`w-1/2 h-full ${th.color_two}`} />
              </div>

              {/* Indicador de Selección (Check Icon) */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <FaCheck color="white"/>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
