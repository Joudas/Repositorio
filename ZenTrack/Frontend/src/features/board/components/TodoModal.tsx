import { createPortal } from "react-dom";
import { useModalStore } from "@/stores/modalStore";
import { deleteTodo, updateTodo } from "@/services/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/UI";
import Comment from "./Comment";

// Icons
import { MdOutlineDescription } from "react-icons/md";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";


export default function TodoModal() {
  
  const { todo, isOpen, close } = useModalStore();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [energy, setEnergy] = useState<"BAJA" | "MEDIA" | "ALTA">("MEDIA");
  const [endDate, setEndDate] = useState("");
  const [checked, setChecked] = useState(false);

  // Sincronizar estado local cuando se abre el modal con un todo
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description ?? "");
      setEnergy(todo.energy ?? "MEDIA");

      setEndDate(todo.endDate ?? "");
      setChecked(todo.check ?? "");
    }
  }, [todo]);


  // Update Todo
  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => updateTodo(todo!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] }); // Need card ID
      close();
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
                  <div className="w-6 h-6 cursor-pointer" onClick={() => setChecked(!checked)}>
                    {
                        checked ? 
                        <FaCheckCircle color="#16DB00" className="w-full h-full" />
                        : 
                        <RiCheckboxBlankCircleLine color="#FFFFFF" className="w-full h-full" />
                    }
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
