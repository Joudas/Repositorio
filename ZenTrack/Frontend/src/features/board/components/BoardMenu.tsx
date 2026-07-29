import { useState, useRef } from "react";
import { useHandleClick } from "../hooks/useHandleClick";
import { useQuery } from "@tanstack/react-query";
import { getThemes } from "@/services/board";
import type { Card } from "@/services/card";
import ZenCard from "./Menu/ZenCard";
import Theme from "./Menu/Theme";

type Submenu = "main" | "zen-card" | "theme" | "delete";

interface Props {
  cards: Card[];
  currentModeZenCard: string;
  onSelectModeZenCard: (cardTitle: string) => void;
  onEditName: () => void;
  onDeleteBoard: () => void;
  onThemeChange: (themeId: string) => void;
  onClose: () => void;
}

export default function BoardMenu({
  cards, currentModeZenCard, onSelectModeZenCard,
  onEditName, onDeleteBoard, onThemeChange, onClose,
}: Props) {
  const [submenu, setSubmenu] = useState<Submenu>("main");
  const containerRef = useRef<HTMLDivElement>(null);
  useHandleClick(containerRef, onClose);

  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: getThemes,
  });

  const handleBack = () => setSubmenu("main");

  if (submenu === "zen-card") {
    return (
      <ZenCard 
      containerRef={containerRef} 
      handleBack={handleBack} 
      currentModeZenCard={currentModeZenCard} 
      cards={cards} 
      onSelectModeZenCard={onSelectModeZenCard}
      onClose={onClose} />
    );
  }

  if (submenu === "theme") {
    return (
      <Theme
      containerRef={containerRef}
      handleBack={handleBack}
      themes={themes}
      onThemeChange={onThemeChange}
      onClose={onClose}
      />
    )
  }

  if (submenu === "delete") {
    return (
      <div
        ref={containerRef}
        className="absolute right-0 top-10 bg-gray-6 rounded-lg shadow-2xl border border-gray-5 z-50 w-56 py-4 px-4"
      >
        <p className="text-gray-2 text-sm font-medium mb-3">Delete this board?</p>
        <p className="text-gray-4 text-xs mb-4">
          This will permanently delete all cards and todos.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-1.5 text-xs text-gray-2 bg-gray-5 rounded-md hover:bg-gray-4 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDeleteBoard();
              onClose();
            }}
            className="flex-1 px-3 py-1.5 text-xs text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  // Main menu (default)
  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-10 bg-gray-6 rounded-lg shadow-2xl border border-gray-5 z-50 w-56 py-2"
    >
      <button
        onClick={() => {
          onEditName();
          onClose();
        }}
        className="w-full text-left px-4 py-2.5 text-gray-2 text-sm hover:bg-gray-5 cursor-pointer flex items-center gap-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit Name
      </button>
      <button
        onClick={() => setSubmenu("zen-card")}
        className="w-full text-left px-4 py-2.5 text-gray-2 text-sm hover:bg-gray-5 cursor-pointer flex items-center gap-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        Definir Zen Card
        <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <button
        onClick={() => setSubmenu("theme")}
        className="w-full text-left px-4 py-2.5 text-gray-2 text-sm hover:bg-gray-5 cursor-pointer flex items-center gap-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        Theme
        <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <div className="border-t border-gray-5 my-1" />
      <button
        onClick={() => setSubmenu("delete")}
        className="w-full text-left px-4 py-2.5 text-red-400 text-sm hover:bg-gray-5 cursor-pointer flex items-center gap-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Delete Board
      </button>
    </div>
  );
}
