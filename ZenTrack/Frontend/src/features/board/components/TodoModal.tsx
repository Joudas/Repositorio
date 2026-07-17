import { createPortal } from "react-dom";
import { useModalStore } from "@/stores/modalStore";
import { updateTodo } from "@/services/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import CheckBox from "./CheckBox";

export default function TodoModal() {
  
  const { todo, isOpen, close } = useModalStore();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [energy, setEnergy] = useState<"BAJA" | "MEDIA" | "ALTA">("MEDIA");
  const [comments, setComments] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sincronizar estado local cuando se abre el modal con un todo
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description ?? "");
      setEnergy(todo.energy ?? "MEDIA");
      setComments(todo.comments ?? "");
      setEndDate(todo.endDate ?? "");
    }
  }, [todo]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => updateTodo(todo!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      close();
    },
  });

  const handleSave = () => {
    const data: Record<string, unknown> = { title };
    if (description !== (todo?.description ?? "")) data.description = description;
    if (energy !== (todo?.energy ?? "MEDIA")) data.energy = energy;
    if (comments !== (todo?.comments ?? "")) data.comments = comments;
    if (endDate !== (todo?.endDate ?? "")) data.endDate = endDate;

    updateMutation.mutate(data);
  };

  if (!isOpen || !todo) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      
    </div>,
    document.body
  );
}
