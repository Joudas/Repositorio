import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBoardById, updateBoard, deleteBoard, updateBoardTheme, updateModeZenCard } from "@/services/board";
//components
import Header from "../../components/layout/Header/Header";
import { Main, InBox, InBoxBar } from "./components/Layout";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import DoingPrompt from "./components/DoingPrompt";

import type { Todo } from "@/type/Todo";
import { moveTodo, reorderTodos } from "@/services/todo";
import { postCard, getCardList } from "@/services/card";
import type { Card } from "@/services/card";
import Spinner from "@/components/UI/Spinner";

export default function BoardScreen() {

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [inBox, setInBox] = useState(true);
  const [isBoard, setIsBoard] = useState(true);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ cardId: string; index: number } | null>(null);

  // Zen mode
  const [zenMode, setZenMode] = useState(false);
  const [doingCardId, setDoingCardId] = useState<string | null>(null);
  const [showDoingPrompt, setShowDoingPrompt] = useState(false);

  const { data: board, isLoading, isError } = useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoardById(id!),
    enabled: !!id,
  });

  const [modeZenCard, setModeZenCard] = useState(board?.modeZenCard ?? "Doing");

  // Sincronizar modeZenCard cuando el board se carga
  useEffect(() => {
    if (board?.modeZenCard) {
      setModeZenCard(board.modeZenCard);
    }
  }, [board?.modeZenCard]);

  const cardsQuery = useQuery({
    queryKey: ["cards", id],
    queryFn: () => getCardList(id!),
    enabled: !!id,
  });

  const createDoingMutation = useMutation({
    mutationFn: () => postCard(id!, modeZenCard),
    onSuccess: (newCard: Card) => {
      setDoingCardId(newCard.id);
      setZenMode(true);
      setShowDoingPrompt(false);
      cardsQuery.refetch();
    },
  });

  const updateZenCardMutation = useMutation({
    mutationFn: (cardTitle: string) => updateModeZenCard(id!, cardTitle),
    onSuccess: () => {
      cardsQuery.refetch();
    },
  });

  const navigate = useNavigate();

  const handleRenameBoard = useCallback((newName: string) => {
    if (!id || !newName.trim()) return;
    updateBoard(id, { name: newName.trim() }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["board", id] });
    });
  }, [id, queryClient]);

  const handleDeleteBoard = useCallback(() => {
    if (!id) return;
    deleteBoard(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      navigate("/dashboard");
    });
  }, [id, queryClient, navigate]);

  const handleThemeChange = useCallback((themeId: string) => {
    if (!id) return;
    updateBoardTheme(id, themeId).then(() => {
      queryClient.invalidateQueries({ queryKey: ["board", id] });
      queryClient.invalidateQueries({ queryKey: ["theme", id] });
    });
  }, [id, queryClient]);

  const handleToggleZen = useCallback(() => {
    if (zenMode) {
      setZenMode(false);
      setDoingCardId(null);
      return;
    }

    // Buscar card con el título configurado en modeZenCard
    const cards = queryClient.getQueryData<Card[]>(["cards", id]);
    const zenCard = cards?.find(
      (c) => c.title === modeZenCard
    );

    if (zenCard) {
      setDoingCardId(zenCard.id);
      setZenMode(true);
    } else {
      setShowDoingPrompt(true);
    }
  }, [zenMode, id, modeZenCard, queryClient]);

  const handleConfirmDoing = useCallback(() => {
    createDoingMutation.mutate();
  }, [createDoingMutation]);

  const handleModeZenCardChange = useCallback((cardTitle: string) => {
    setModeZenCard(cardTitle);
    updateZenCardMutation.mutate(cardTitle);
  }, [updateZenCardMutation]);

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
            {isBoard && <Main board={board} hoverPosition={hoverPosition} zenMode={zenMode} modeZenCard={modeZenCard} onToggleZen={handleToggleZen} onModeZenCardChange={handleModeZenCardChange} onRenameBoard={handleRenameBoard} onDeleteBoard={handleDeleteBoard} onThemeChange={handleThemeChange} />}
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
        isBoard={isBoard}
        />
        <DoingPrompt
          isOpen={showDoingPrompt}
          onClose={() => setShowDoingPrompt(false)}
          onConfirm={handleConfirmDoing}
          isCreating={createDoingMutation.isPending}
        />
    </div>
  );
}
