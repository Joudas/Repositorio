import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { GrContract, GrExpand } from "react-icons/gr";
import { FiMoreVertical } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import { type Card } from "@/services/card";
import { deleteCard } from "@/services/card";
import { getTodo } from "@/services/todo";

import Todo from "./Todo";
import TodoAdd from "./TodoAdd";

// Dnd-kit
import {useDroppable} from '@dnd-kit/react';
import { useHandleClick } from "../hooks/useHandleClick";
import React from "react";

type Props = {
  card: Card;
  boardId: string;
  hoverPosition?: { cardId: string; index: number } | null;
}

export default function Card({ card, boardId, hoverPosition }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isAdd, setIsAdd] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const {ref} = useDroppable({
    id: card.id,
  });

  const setClose = () => {
      setIsAdd(false);
    }
      
  useHandleClick(containerRef, setClose);
  useHandleClick(menuRef, () => setMenuOpen(false));

  const [contractCard, setContractCard] = useState(false);

  const { data: todos } = useQuery({
    queryKey: ["todos", card.id],
    queryFn: () => getTodo(card.id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCard(card.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", boardId] });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setMenuOpen(false);
  };
  
  return (
    <div className="gap-4 overflow-x-auto text-sm" ref={ref} data-card-id={card.id}>
      <div ref={containerRef} className={`bg-gray-6 min-w-8 rounded-lg pb-2 pt-4 px-2 flex flex-col gap-4 self-start ${contractCard ? "" : "custom-scroll"}`}>
      {
        contractCard ? 
        
          <div className="min-h-20 w-5 flex flex-col gap-4">
            <span
              onClick={() => setContractCard(false)}
              className="cursor-pointer  text-gray-3 hover:text-gray-1 flex justify-center items-center">
              <GrExpand/>
            </span>
            <p className="self-start text-gray-1 font-semibold [writing-mode:vertical-rl]">{card.title}</p>
          </div>
        :
        <div className="min-h-12 w-68 flex flex-col gap-2">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-gray-1 font-semibold">{card.title}</p>
            <div className="flex items-center gap-3">
              {/* Menu de card */}
              <div className="relative" ref={menuRef}>
                <span
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                  className="cursor-pointer text-gray-3 hover:text-gray-1"
                >
                  <FiMoreVertical size="16" />
                </span>
                {menuOpen && (
                  <div className="absolute right-0 top-6 bg-gray-5 rounded-md shadow-lg z-50 w-36 py-1">
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-2 hover:bg-gray-4 cursor-pointer"
                    >
                      <MdDeleteOutline size="16" />
                      Delete Card
                    </button>
                  </div>
                )}
              </div>
              <span
                onClick={() => setContractCard(true)}
                color="white" 
                className="cursor-pointer  text-gray-3 hover:text-gray-1">
                <GrContract/>
              </span>
            </div>
          </div>
          {todos?.map((todo, idx) => (
            <React.Fragment key={todo.id}>
              {hoverPosition?.cardId === card.id && hoverPosition.index === idx && (
                <div className="h-20 border-2 border-dashed border-brand-muted rounded-md w-full" />
              )}
              <Todo todo={todo} />
            </React.Fragment>
          ))}
          {hoverPosition?.cardId === card.id && hoverPosition.index === (todos?.length ?? 0) && (
            <div className="h-20 border-2 border-dashed border-brand-muted rounded-md w-full" />
          )}
          
          <TodoAdd cardId={card.id} isAdd={isAdd} setIsAdd={setIsAdd} />
        </div>
      }
      </div>
    </div>
  );
}
