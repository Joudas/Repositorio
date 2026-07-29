import BoardMenu from "@/features/board/components/BoardMenu";
import { SlOptions } from "react-icons/sl";
import { FaRegSun } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Board } from "@/type/Board";
import type { Card } from "@/services/card";

type Props = {
    board: Board;
    zenMode?: boolean;
    modeZenCard: string | undefined;
    cards: NoInfer<Card[]> | undefined;
    onToggleZen?: () => void;
    onModeZenCardChange?: (cardTitle: string) => void;
    onRenameBoard: (name: string) => void;
    onDeleteBoard: () => void;
    onThemeChange: (themeId: string) => void;
}

export default function Header({board, zenMode, modeZenCard, cards, onToggleZen, onModeZenCardChange, onRenameBoard, onDeleteBoard, onThemeChange}: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(board?.name ?? "");
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
        }
    }, [isEditingTitle]);

    const handleStartEdit = useCallback(() => {
        setNewTitle(board?.name ?? "");
        setIsEditingTitle(true);
    }, [board?.name]);

    const handleSaveTitle = useCallback(() => {
        if (newTitle.trim() && newTitle.trim() !== board?.name) {
        onRenameBoard(newTitle.trim());
        }
        setIsEditingTitle(false);
    }, [newTitle, board?.name, onRenameBoard]);

    const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
        handleSaveTitle();
        } else if (e.key === "Escape") {
        setIsEditingTitle(false);
        }
    }, [handleSaveTitle]);

  return (
    <div className="w-full h-14 relative">
        <div className="w-full h-full bg-black opacity-50 absolute z-1"></div>
        <div className="w-full h-full px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 z-2">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleTitleKeyDown}
                className="bg-gray-7 text-gray-1 font-semibold text-xl px-2 py-1 rounded-md border border-gray-5 focus:outline-none focus:border-brand-primary w-64"
              />
            ) : (
              <p className="text-gray-1 font-semibold text-xl">{board?.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2 relative z-2">
            <button
              onClick={onToggleZen}
              title={zenMode ? "Exit Zen" : "Zen Mode"}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                zenMode
                  ? "bg-brand-primary text-white"
                  : "text-gray-3 hover:text-gray-1 hover:bg-gray-5"
              }`}
            >
              <FaRegSun color="white" size="20"/>
            </button>
            <SlOptions
              size="28"
              className="cursor-pointer text-white hover:text-gray-3"
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            {menuOpen && cards && (
              <BoardMenu
                cards={cards}
                currentModeZenCard={modeZenCard ?? "Doing"}
                onSelectModeZenCard={onModeZenCardChange!}
                onEditName={handleStartEdit}
                onDeleteBoard={onDeleteBoard}
                onThemeChange={onThemeChange}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
  )
}
