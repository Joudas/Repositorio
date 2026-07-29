import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postBoard, getThemes } from "@/services/board";

export const useFormBoard = (onClose: () => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const queryTheme = useQuery({ queryKey: ['themes'], queryFn: getThemes });
  const [selectedId, setSelectedId] = useState<string>(
    queryTheme?.data ? queryTheme.data[0]?.id : "1"
  );

  const boardMutation = useMutation({
    mutationFn: (title: string) => postBoard(title, selectedId),
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      onClose();
      setName("");
      navigate(`/board/${board.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    boardMutation.mutate(name);
  };

  return {
    name,
    setName,
    selectedId,
    setSelectedId,
    queryTheme,
    boardMutation,
    handleSubmit
  };
};