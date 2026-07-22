import { useState } from "react";
import type { Card } from "@/services/card";
import TodoAdd from "./TodoAdd";
import { type Todo as TodoType } from "@/type/Todo"

import Todo from "./Todo"
import {useDroppable} from '@dnd-kit/react';
import React from "react";

type Props = {
    todos: TodoType[]; 
    card: Card;
    hoverPosition?: { cardId: string; index: number } | null;
}

export default function InBoxCard({todos, card, hoverPosition}: Props) {
    const [isAdd, setIsAdd] = useState(false);
    const {ref} = useDroppable({
        id: card.id,
    });
    return (
        <div className="px-2 gap-3 flex flex-col flex-1 overflow-hidden" ref={ref} data-card-id={card.id}>
                <div className="bg-gray-6 p-1 min-h-8 w-full rounded-lg shrink-0">
                    <TodoAdd cardId={card?.id} isAdd={isAdd} setIsAdd={setIsAdd} />
                </div>
            <div className="flex-1 overflow-y-auto custom-scroll space-y-3">
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
            </div>
        </div>
  )
}
