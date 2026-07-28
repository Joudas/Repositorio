import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from "@/stores/modalStore";

import { Button } from "@/components/UI";
import Comment from "../Comment/Comment";

// Icons
import { MdOutlineDescription } from "react-icons/md";
import AnimationPresenceCheck from "../Checkbox/AnimationPresenceCheck";

import type { Todo } from "@/type/Todo";
import { deleteTodo, updateTodo } from "@/services/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function TodoModal() {
  
  const { todo, isOpen, close } = useModalStore();
  if(!todo) return;
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [energy, setEnergy] = useState<"BAJA" | "MEDIA" | "ALTA">(todo.energy ?? "MEDIA");
  const [endDate, setEndDate] = useState(todo.endDate ?? "");
  const [checked, setChecked] = useState(todo.check ?? false);

  const toggleMutation = useMutation({
    mutationFn: () => updateTodo(todo.id, { check: !todo.check }),
    onMutate: async () => {
      // Optimistic update: cambiar el check inmediatamente en el cache
      const previous = queryClient.getQueryData<Todo[]>(["todos", todo.cardId]);
      queryClient.setQueryData<Todo[]>(["todos", todo.cardId], (old) =>
        old?.map((t) => (t.id === todo.id ? { ...t, check: !todo.check } : t))
      );
      return { previous };
    },
    onSuccess: () => {
      setChecked(!checked);
    },
    onError: (_err, _vars, context) => {
      // Rollback si la API falla
      if (context?.previous) {
        queryClient.setQueryData(["todos", todo.cardId], context.previous);
      }
    },
  });

  // Update Todo
  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => updateTodo(todo!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", todo!.cardId] });
      close();
    },
    onError: (err) => {
      console.error("Error al actualizar todo:", err);
    },
  });

  // Delete Todo
  const deleteMutation = useMutation({
    mutationFn: () => deleteTodo(todo!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      close();
    },
  });


  const handleSave = () => {
    const data: Record<string, unknown> = { title };
    data.check = checked;
    if (description !== (todo?.description ?? "")) data.description = description;
    if (energy !== (todo?.energy ?? "MEDIA")) data.energy = energy;
    if (endDate !== (todo?.endDate ?? "")) data.endDate = endDate;

    updateMutation.mutate(data);
  };

  if (!isOpen || !todo) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="bg-gray-6  rounded-xl w-280  mt-20 shadow-2xl border border-gray-5">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-5">
          <h2 className="text-gray-1 font-semibold text-md">Edit Todo</h2>
          <button
            onClick={close}
            className="text-gray-3 hover:text-gray-1 cursor-pointer text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2">
          <div className="p-10">
              {/* Body */}
              <div className="space-y-4 w-full">
                {/* Title */}
                <div className="flex items-center">
                  <div className="w-6 h-6 cursor-pointer" onClick={() => toggleMutation.mutate()} >
                    <AnimationPresenceCheck check={checked} />
                  </div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full font-semibold text-2xl text-gray-1 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-brand-muted"
                  />
                </div>

                {/* Description */}
                <div className=" flex flex-col gap-2">
                  <label className="text-gray-2 text-md font-semibold mb-1 flex gap-2 items-center">
                    <MdOutlineDescription /> 
                    Description
                  </label>
                  <textarea
                    placeholder="Enter details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-14 max-h-80 bg-gray-6 ring-1 ring-gray-4 text-gray-1 rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-brand-primary resize-none overflow-y-scroll wrap-break-words custom-scroll"
                  />
                </div>
              </div>

            </div>

            <Comment todo={todo} />
          </div>



          {/* Energy + Check */}
          {/* <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-gray-3 text-sm block mb-1">Energy</label>
              <select
                value={energy}
                onChange={(e) => setEnergy(e.target.value as "BAJA" | "MEDIA" | "ALTA")}
                className="w-full bg-gray-5 text-gray-1 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
              >
                <option value="BAJA">⚡ Baja</option>
                <option value="MEDIA">⚡ Media</option>
                <option value="ALTA">⚡ Alta</option>
              </select>
            </div>
            
          </div> */}
          

          {/* Comments */}
          <div className="flex justify-between gap-3 p-4 border-t border-gray-5">
            <div>
              <button
                onClick={() => deleteMutation.mutate()}
                className="px-4 py-2 rounded-md text-gray-3 hover:text-gray-1 hover:bg-gray-5 cursor-pointer"
              >
                Delete
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="px-4 py-2 rounded-md text-gray-3 hover:text-gray-1 hover:bg-gray-5 cursor-pointer"
              >
                Cancel
              </button>
              <div className="h-8 w-30">
                <Button onClick={handleSave} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
      </div>,
    document.body
  );
}
