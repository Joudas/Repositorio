import type { Theme } from '@/type/Theme'
import React from 'react'

type Props = {
    containerRef: React.RefObject<HTMLDivElement | null>
    handleBack: () => void
    themes: NoInfer<Theme[]> | undefined
    onThemeChange: (themeId: string) => void
    onClose: () => void
}

export default function Theme({
    containerRef,
    handleBack,
    themes,
    onThemeChange,
    onClose,
}: Props) {
  return (
    <div
        ref={containerRef}
        className="absolute right-0 top-10 bg-gray-6 rounded-lg shadow-2xl border border-gray-5 z-50 w-56 py-3"
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 pb-2 text-gray-3 text-xs hover:text-gray-1 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <p className="text-gray-3 text-xs font-semibold px-4 pb-2 uppercase tracking-wide">
          Select Theme
        </p>
        <ul className="text-gray-2 text-sm max-h-48 overflow-y-auto custom-scroll">
          {themes?.map((theme) => (
            <li
              key={theme.id}
              onClick={() => {
                onThemeChange(theme.id);
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-5"
            >
              <div
                className="w-6 h-6 rounded-full border border-gray-5 shrink-0"
                style={
                  theme.mode === "COLOR"
                    ? {
                        background: `linear-gradient(to right, ${theme.color_one ?? "#333"}, ${theme.color_two ?? "#333"})`,
                      }
                    : theme.image
                      ? { backgroundImage: `url(/${theme.image}.jpg)`, backgroundSize: "cover" }
                      : { background: "#555" }
                }
              />
              <span>{theme.name}</span>
            </li>
          ))}
        </ul>
      </div>
  )
}
