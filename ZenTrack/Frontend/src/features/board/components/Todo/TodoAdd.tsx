import { useState, useCallback } from 'react'
import { Button } from "@/components/UI";
import { IoIosClose } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postTodo } from '@/services/todo';
import type { Todo } from '@/type/Todo';

type Props = {
    setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
    isAdd: boolean;
    cardId:string;
}

export default function TodoAdd({cardId, setIsAdd, isAdd} : Props) {

    const queryClient = useQueryClient();

    const [inputAdd, setInputAdd] = useState("");

    const addTodo = useMutation({
        mutationFn: () => postTodo(cardId, inputAdd),
        onMutate: async () => {
            // Snapshot previo para rollback
            const previous = queryClient.getQueryData<Todo[]>(["todos", cardId]);
            
            // Optimistic: agregar todo al cache instantáneamente
            const optimisticTodo: Todo = {
                id: `temp-${Date.now()}`,
                title: inputAdd,
                description: null,
                energy: "MEDIA",
                comments: null,
                position: (previous?.length ?? 0),
                check: false,
                endDate: null,
                cardId,
            };
            
            queryClient.setQueryData<Todo[]>(["todos", cardId], (old) => [
                ...(old || []),
                optimisticTodo,
            ]);
            
            return { previous, optimisticId: optimisticTodo.id };
        },
        onSuccess: (data, _vars, context) => {
            // Reemplazar el todo optimístico con el real del servidor
            queryClient.setQueryData<Todo[]>(["todos", cardId], (old) =>
                old?.map((t) => (t.id === context?.optimisticId ? { ...data, cardId } : t))
            );
        },
        onError: (_err, _vars, context) => {
            // Rollback: restaurar snapshot
            if (context?.previous) {
                queryClient.setQueryData(["todos", cardId], context.previous);
            }
        },
    });

    const handleClick = useCallback(() => {
        if (!inputAdd.trim()) return;
        addTodo.mutate();
        setIsAdd(false);
        setInputAdd("");
    }, [inputAdd, addTodo, setIsAdd]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleClick();
        }
    }, [handleClick]);

    const closeAdd = () => {
        setIsAdd(false);
        setInputAdd("");
    }

  return (
    <div>
        {
            isAdd ? 
                <>
                    <textarea 
                    className="w-full min-h-12 max-h-25 py-2 px-4 bg-gray-5 text-gray-1 rounded-md focus:outline-none resize-none overflow-y-scroll wrap-break-words custom-scroll"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                    placeholder="Enter a title Todo"
                    value={inputAdd}
                    onChange={(e) => setInputAdd(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={500}
                    autoFocus
                    />
                    <div className='flex justify-between items-center h-8 mb-1 '>
                        <div className='h-full w-30 '>
                            <Button
                            onClick={handleClick}
                            disabled={!inputAdd.trim()}>
                                Add Todo 
                            </Button>
                        </div>
                        <span className='text-white cursor-pointer' onClick={closeAdd}>
                            <IoIosClose size="2.5em"/>
                        </span>
                    </div>
                </>
            :
                <button 
                onClick={() => setIsAdd(true)}
                className="rounded-sm hover:bg-gray-4 w-full h-full px-2 py-2 cursor-pointer text-gray-1 text-left flex items-center gap-1">
                    <GoPlus size="1.5em"/>
                    Add Todo
                </button>
        }
    </div>
  )
}
