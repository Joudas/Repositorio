import { useRef } from "react";
import { Button } from "@/components/UI";
import { useHandleClick } from "@/features/board/hooks/useHandleClick";
import { useFormBoard } from "@/hooks/useFormBoard";
import { ThemePicker } from "@/components/UI/ThemePicker"; // Componente extraído
import { IoCloseSharp } from "react-icons/io5";

interface Props {
  setFormBoard: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FormBoard({ setFormBoard }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleClose = () => setFormBoard(false);
  useHandleClick(containerRef, handleClose);

  // Consumimos la lógica limpia desde nuestro Custom Hook
  const { 
    name, setName, selectedId, setSelectedId, queryTheme, boardMutation, handleSubmit 
  } = useFormBoard(handleClose);

  return (
    <div ref={containerRef} className="bg-gray-6 text-gray-4 w-80 absolute top-0 -left-2 border-gray-5 border rounded-lg z-50">
      <div className="w-full flex px-4 justify-between items-center">
        <p className="text-sm py-4 px-2">Create Board</p>
        <button onClick={handleClose} className="cursor-pointer hover:text-gray-2 transition-all delay-100">
          <IoCloseSharp />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 justify-center px-4 pb-4 mb-2">
        <div>
          {/* El ThemePicker ahora es un componente independiente y limpio */}
          {
            queryTheme.data &&
            <ThemePicker 
              themes={queryTheme.data} 
              selectedId={selectedId} 
              onSelect={setSelectedId} 
            />
          }
          
          <label htmlFor="board-name" className="self-start px-2 text-xs grid gap-2 mt-4 text-gray-3">
            Board Title
          </label>
          <input
            id="board-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full outline-none border-gray-2 border-b rounded-sm p-2"
            type="text"
            placeholder="Enter a Title"
          />
        </div>
        
        <div className="h-8 text-sm">
          <Button type="submit" disabled={boardMutation.isPending}>
            {boardMutation.isPending ? "Creating..." : "Create Board"}
          </Button>
        </div>
      </form>
    </div>
  );
}