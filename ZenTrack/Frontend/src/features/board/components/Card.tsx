import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { GrContract, GrExpand } from "react-icons/gr";

import { type Card } from "@/services/card";
import { getTodo } from "@/services/todo";

import Todo from "./Todo";
import TodoAdd from "./TodoAdd";

// Dnd-kit
import {useDroppable} from '@dnd-kit/react';
import { useHandleClick } from "../hooks/useHandleClick";

type Props = {
  card: Card;
}

export default function Card({ card }: Props) {

    const containerRef = useRef<HTMLDivElement>(null);
  
  const [isAdd, setIsAdd] = useState(false);
  const {ref} = useDroppable({
    id: card.id,
  });

  const setClose = () => {
      setIsAdd(false);
    }
      
      useHandleClick(containerRef, setClose);

  const [contractCard, setContractCard] = useState(false);

  const { data: todos } = useQuery({
    queryKey: ["todos", card.id],
    queryFn: () => getTodo(card.id),
  });
  
  return (
    <div className="gap-4 overflow-x-auto text-sm" ref={ref} >
      <div ref={containerRef} className={`bg-gray-6 min-w-8 rounded-lg pb-2 pt-4 px-2 flex flex-col gap-4 self-start ${contractCard ? "" : "custom-scroll"}`}>
      {
        contractCard ? 
        
          <div className="min-h-20 w-5 flex flex-col gap-4">
            <span
              onClick={() => setContractCard(false)}
              color="white" 
              className="cursor-pointer">
              <GrExpand color="white"/>
            </span>
            <p className="self-start text-gray-1 font-semibold [writing-mode:vertical-rl]">{card.title}</p>
          </div>
        :
        <div className="min-h-12 w-68 flex flex-col gap-2">
          <div className="flex justify-between px-3 mb-2">
            <p className="self-start text-gray-1 font-semibold">{card.title}</p>
            <span
              onClick={() => setContractCard(true)}
              color="white" 
              className="cursor-pointer">
              <GrContract color="white"/>
            </span>
          </div>
          {todos?.map(todo => <Todo todo={todo} key={todo.id} />)}
          
          <TodoAdd cardId={card.id} isAdd={isAdd} setIsAdd={setIsAdd} />
        </div>
      }
      </div>
    </div>
  );
}
