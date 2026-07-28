import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBoardById } from "@/services/board";
//components
import Header from "../../components/layout/Header/Header";
import { Main, InBox, InBoxBar } from "./components/Layout";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";

import type { Todo } from "@/type/Todo";
import { moveTodo, reorderTodos } from "@/services/todo";
import Spinner from "@/components/UI/Spinner";

export default function BoardScreen() {

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [inBox, setInBox] = useState(true);
  const [isBoard, setIsBoard] = useState(true);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ cardId: string; index: number } | null>(null);

  const { data: board, isLoading, isError } = useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoardById(id!),
    enabled: !!id,
  });

  const handleDragStart = useCallback((event: { operation: { source?: { id: unknown } } }) => {
    const sourceId = event.operation.source?.id as string | undefined;
    if (!sourceId) {
      setActiveTodo(null);
      return;
    }

    const todoQueries = queryClient.getQueriesData<Todo[]>({ queryKey: ["todos"] });
    for (const [, data] of todoQueries) {
      const found = data?.find((t: Todo) => t.id === sourceId);
      if (found) {
        setActiveTodo(found);
        return;
      }
    }
    setActiveTodo(null);
  }, [queryClient]);

  const handleDragMove = useCallback((event: { operation: { target?: { id: unknown }; position?: { x: number; y: number } } }) => {
    const targetId = event.operation.target?.id as string | undefined;
    const position = event.operation.position;

    if (!targetId || !position) {
      setHoverPosition(null);
      return;
    }

    const cursorY = position.y;
    const todoEls = document.querySelectorAll(`[data-card-id="${targetId}"] [data-todo-id]`);

    let insertIdx = 0;
    todoEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (cursorY > mid) insertIdx++;
    });

    setHoverPosition({ cardId: targetId, index: insertIdx });
  }, []);

  const handleDragEnd = useCallback((event: { canceled?: boolean; operation: { source?: { id: unknown }; target?: { id: unknown } } }) => {
    setActiveTodo(null);
    setHoverPosition(null);

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

    // Save snapshot for rollback on error
    const sourceSnapshot = queryClient.getQueryData<Todo[]>(["todos", sourceCardId]);
    if (!sourceSnapshot) return;

    const todoToMove = sourceSnapshot.find((t: Todo) => t.id === sourceId);
    if (!todoToMove) return;

    // Remove from source instantly
    queryClient.setQueryData<Todo[]>(["todos", sourceCardId],
      sourceSnapshot.filter((t: Todo) => t.id !== sourceId)
    );

    const insertAt = hoverPosition?.cardId === targetId ? hoverPosition.index : -1;

    if (sourceCardId === targetId) {
      // Same card — reorder with position
      const current = queryClient.getQueryData<Todo[]>(["todos", targetId]) || [];
      const reordered = [...current];
      const updatedTodo = { ...todoToMove, cardId: targetId };

      if (insertAt >= 0 && insertAt <= reordered.length) {
        reordered.splice(insertAt, 0, updatedTodo);
      } else {
        reordered.push(updatedTodo);
      }

      queryClient.setQueryData<Todo[]>(["todos", targetId], reordered);

      const payload = reordered.map((t, i) => ({ id: t.id, position: i }));
      reorderTodos(sourceCardId, payload).catch(() => {
        // Rollback on error — restore snapshot
        queryClient.setQueryData<Todo[]>(["todos", sourceCardId], sourceSnapshot);
      });
      return;
    }

    // Cross-card with position
    const targetSnapshot = queryClient.getQueryData<Todo[]>(["todos", targetId]) || [];
    const updatedTodo = { ...todoToMove, cardId: targetId };

    const updatedTarget = [...targetSnapshot];
    if (insertAt >= 0 && insertAt <= updatedTarget.length) {
      updatedTarget.splice(insertAt, 0, updatedTodo);
    } else {
      updatedTarget.push(updatedTodo);
    }

    queryClient.setQueryData<Todo[]>(["todos", targetId], updatedTarget);

    // Async API call — no invalidation, only rollback on error
    moveTodo(sourceId, targetId, insertAt >= 0 ? insertAt : undefined).catch(() => {
      // Rollback both cards
      queryClient.setQueryData<Todo[]>(["todos", sourceCardId], sourceSnapshot);
      queryClient.setQueryData<Todo[]>(["todos", targetId], targetSnapshot);
    });
  }, [queryClient, hoverPosition]);

  if (isLoading) return (
    <div className="w-screen h-screen flex flex-col bg-gray-6">
      <Header />
      <Spinner />
    </div>
  );

  if (isError) return (
    <div className="w-screen h-screen flex flex-col bg-gray-6">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-2 text-lg">Error loading boards. Try again later.</p>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden relative">
      <Header showCreateBoard={false} />
        <div className="flex flex-1 overflow-hidden">
          <DragDropProvider onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
            {
              inBox && 
              <div className={`h-full ${isBoard ? "" : "w-full"}`}>
                <InBox isBoard={isBoard} board={board} hoverPosition={hoverPosition} />
              </div>
            }
            {isBoard && <Main board={board} hoverPosition={hoverPosition} />}
            <DragOverlay dropAnimation={null}>
              {(source) => {
                if (!source) return null;
                return (
                  <div className="rounded-md bg-gray-5 text-gray-1 p-2 px-4 shadow-lg ring-2 ring-brand-muted opacity-90">
                    {activeTodo?.title ?? source.id as string}
                  </div>
                );
              }}
            </DragOverlay>
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
