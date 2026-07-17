import { Button } from "@/components/UI";
import { postBoard } from "@/services/board";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useHandleClick } from "../hooks/useHandleClick";

interface Props {
  setFormBoard: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FormBoard({ setFormBoard }: Props) {
  const navigate = useNavigate();
  const [name, setName] = useState("");

    const containerRef = useRef<HTMLDivElement>(null);
    const setClose = () => {
        setFormBoard(false);
    }
    useHandleClick(containerRef, setClose);

  const boardMutation = useMutation({
    mutationFn: (title: string) => postBoard(title),
    onSuccess: (board) => {
      setFormBoard(false);
      setName("");
      navigate(`/board/${board.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    boardMutation.mutate(name);
  };

  return (
    <div ref={containerRef} className="bg-gray-6 text-gray-4 w-80 absolute top-10 -left-24 rounded-lg z-50">
      <div className="w-full flex px-4 justify-between items-center">
        <p className="text-sm py-4">Create Board</p>
        <div className="cursor-pointer hover:text-gray-2 transition-all delay-100" onClick={() => setFormBoard(false)}>
          <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="currentColor"></path>
            </g>
          </svg>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 justify-center p-2 p-4 mb-2">
          <div>
            <label htmlFor="board-name" className="self-start px-2 text-xs grid gap-2">
              Board Title
            </label>
            <input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              name="name"
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
    </div>
  );
}
