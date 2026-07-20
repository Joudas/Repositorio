import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBoardById } from "@/services/board";
//components
import Header from "./components/Header";
import InBox from "./components/InBox";
import Main from "./components/Main";
import InBoxBar from "./components/InBoxBar";
import { DragDropProvider } from "@dnd-kit/react";

import type { Todo } from "@/type/Todo";
import { moveTodo, reorderTodos } from "@/services/todo";

export default function BoardScreen() {

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [inBox, setInBox] = useState(true);
  const [isBoard, setIsBoard] = useState(true);

  const { data: board } = useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoardById(id!),
    enabled: !!id,
  });

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden relative">
      <Header />
        <div className="flex flex-1 overflow-hidden">
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return;

              const sourceId = event.operation.source?.id as string | undefined;
              const targetId = event.operation.target?.id as string | undefined;

              if (!sourceId || !targetId) return;

              // Find source todo's cardId from query cache
              const todoQueries = queryClient.getQueriesData<Todo[]>({ queryKey: ["todos"] });

              let sourceCardId: string | null = null;
              for (const [key, data] of todoQueries) {
                if (data?.some((t: Todo) => t.id === sourceId)) {
                  sourceCardId = key[1] as string;
                  break;
                }
              }

              if (!sourceCardId) return;

              // ── Optimistic update (synchronous) ──
              const sourceTodos = queryClient.getQueryData<Todo[]>(["todos", sourceCardId]);
              if (!sourceTodos) return;

              const todoToMove = sourceTodos.find((t: Todo) => t.id === sourceId);
              if (!todoToMove) return;

              // Remove from source instantly
              queryClient.setQueryData<Todo[]>(["todos", sourceCardId],
                sourceTodos.filter((t: Todo) => t.id !== sourceId)
              );

              if (sourceCardId === targetId) {
                // Same card — reorder: append to end
                const reordered = [...(queryClient.getQueryData<Todo[]>(["todos", targetId]) || [])];
                const updatedTodo = { ...todoToMove, cardId: targetId };
                reordered.push(updatedTodo);

                queryClient.setQueryData<Todo[]>(["todos", targetId], reordered);

                const payload = reordered.map((t, i) => ({ id: t.id, position: i }));
                reorderTodos(sourceCardId, payload).finally(() => {
                  queryClient.invalidateQueries({ queryKey: ["todos", sourceCardId] });
                });
                return;
              }

              // Cross-card — add to target instantly
              const targetTodos = queryClient.getQueryData<Todo[]>(["todos", targetId]) || [];
              const updatedTodo = { ...todoToMove, cardId: targetId };
              queryClient.setQueryData<Todo[]>(["todos", targetId], [...targetTodos, updatedTodo]);

              // Async API call — UI already updated
              moveTodo(sourceId, targetId).finally(() => {
                queryClient.invalidateQueries({ queryKey: ["todos", sourceCardId] });
                queryClient.invalidateQueries({ queryKey: ["todos", targetId] });
              });
            }}
          >
            {
              inBox && 
              <div className={`h-full ${isBoard ? "" : "w-full"}`}>
                <InBox isBoard={isBoard} board={board} />
              </div>
            }
            {isBoard && <Main board={board} />}
          </DragDropProvider>
        </div>
        <InBoxBar 
        setInBox={setInBox} 
        inBox={inBox}
        setIsBoard={setIsBoard}
        isBoard={isBoard}/>
    </div>
  );
}
