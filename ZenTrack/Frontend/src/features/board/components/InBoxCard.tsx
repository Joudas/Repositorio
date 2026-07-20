import type { Card } from "@/services/card";
import TodoAdd from "./TodoAdd";
import { type Todo as TodoType } from "@/type/Todo"

import Todo from "./Todo"
import {useDroppable} from '@dnd-kit/react';

type Props = {
    todos: TodoType[]; 
    card: Card;
}

export default function InBoxCard({todos, card}: Props) {
    const {ref} = useDroppable({
        id: card.id,
    });
    return (
        <div className="px-2 gap-3 flex flex-col h-full" ref={ref}>
                <div className="bg-gray-6 p-1 min-h-8 w-full rounded-lg">
                    <TodoAdd cardId={card?.id}/>
                </div>
            {todos?.map(todo => <Todo todo={todo} key={todo.id} />)}
        </div>
  )
}
