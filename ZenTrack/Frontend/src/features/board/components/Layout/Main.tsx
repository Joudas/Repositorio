import { useState, useCallback, useRef, useEffect } from "react";
import { getThemeById } from "@/services/board";
import Card from "../Card/Card";
import { useQuery } from "@tanstack/react-query";
import { getCardList } from "@/services/card";
import AddCardForm from "../Card/AddCardForm";
import type { Board } from "@/type/Board";
import Header from "./Header";

interface Props {
  board: Board;
  hoverPosition?: { cardId: string; index: number } | null;
  zenMode?: boolean;
  modeZenCard?: string;
  onToggleZen?: () => void;
  onModeZenCardChange?: (cardTitle: string) => void;
  onRenameBoard: (name: string) => void;
  onDeleteBoard: () => void;
  onThemeChange: (themeId: string) => void;
}

export default function Main({ board, hoverPosition, zenMode, modeZenCard, onToggleZen, onModeZenCardChange, onRenameBoard, onDeleteBoard, onThemeChange }: Props) {


  const {data: theme, isLoading} = useQuery({ 
    queryKey: ['theme', board?.id], 
    queryFn: () => getThemeById(board!.themeId)
  })

  const {data: cards} = useQuery({
    queryKey: ["cards", board?.id],
    queryFn: () => getCardList(board!.id),
    enabled: !!board,
  });

  const bgStyle = (!isLoading && theme)
    ? theme.mode === "COLOR" && theme.color_one && theme.color_two
      ? { backgroundImage: `linear-gradient(to bottom right, ${theme.color_one}, ${theme.color_two})` }
      : theme.mode === "IMAGE" && theme.image
        ? { backgroundImage: `url(/${theme.image}.jpg)`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
        : { backgroundImage: "url('/bg-zentrack.jpg')", backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : { backgroundImage: "url('/bg-zentrack.jpg')", backgroundSize: "cover" as const, backgroundPosition: "center" as const };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden" style={bgStyle}>
      <Header 
      board={board} 
      zenMode={zenMode}
      modeZenCard={modeZenCard} 
      cards={cards} 
      onToggleZen={onToggleZen}
      onModeZenCardChange={onModeZenCardChange}
      onRenameBoard={onRenameBoard} 
      onDeleteBoard={onDeleteBoard} 
      onThemeChange={onThemeChange} 
      />
      <div className="p-4  py-2 flex gap-4">
        
        {
          zenMode && modeZenCard
            ? cards
                ?.filter((card) => card.title === modeZenCard)
                .map((card) => (
                  <Card card={card} key={card.id} boardId={board!.id} hoverPosition={hoverPosition} />
                ))
            : cards?.map((card) => {
                return <Card card={card} key={card.id} boardId={board!.id} hoverPosition={hoverPosition} />
              })
        }
        {!zenMode && board && <AddCardForm boardId={board.id} />}

      </div>
    </div>
  );
}
