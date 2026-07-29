import { useState, useRef, useEffect, useCallback } from "react";

import { useQuery } from "@tanstack/react-query";
import { getInBox } from "@/services/card";
import type { Board } from "@/services/board";

import { getTodo } from "@/services/todo";
import InBoxCard from "../Card/InBoxCard";


interface Props {
  board: Board | undefined;
  isBoard: boolean;
  hoverPosition?: { cardId: string; index: number } | null;
}

export default function InBox({board, isBoard, hoverPosition} : Props) {
  const [width, setWidth] = useState(280); // px — ≈ 22% en pantalla 1280
  const dragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const newWidth = Math.min(Math.max(e.clientX, 200), window.innerWidth * 0.5);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const {data: card} = useQuery({
    queryKey: ['inBox', board?.id], 
    queryFn: () => getInBox(board!.id),
    enabled: !!board,
  });

  const { data: todos } = useQuery({
    queryKey: ["todos", card?.id],
    queryFn: () => getTodo(card!.id),
    enabled: !!card,
  });

  return (
    <div
      className="h-full bg-gray-6 text-gray-1 overflow-y-auto relative px-4 shrink-0"
      style={isBoard ? { width } : {}}
    >
      <div className="w-full bg-blue-800 rounded-lg h-full flex flex-col overflow-hidden">
        <div className="flex justify-between rounded-t-lg bg-blue-900 p-4 mb-2">
          <p className="text-md font-medium">InBox</p>
          <div className="flex gap-2">
            <div className="cursor-pointer">
              <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M4 6H20M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </svg>
            </div>
            <div className="cursor-pointer">
              <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M18 8L6 8M6 8L10.125 4M6 8L10.125 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path opacity="0.5" d="M6 16L18 16M18 16L13.875 12M18 16L13.875 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
        
        { card && todos && <InBoxCard todos={todos} card={card} hoverPosition={hoverPosition} />}
      </div>

      {/* Drag handle */}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-brand-primary transition-colors"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
