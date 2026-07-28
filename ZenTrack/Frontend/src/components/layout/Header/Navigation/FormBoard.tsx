import { Button } from "@/components/UI";
import { postBoard, getThemes } from "@/services/board";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useHandleClick } from "@/features/board/hooks/useHandleClick";

interface Props {
  setFormBoard: React.Dispatch<React.SetStateAction<boolean>>;
}
interface ThemeOption {
  id: string;
  name: string;
  colorOne: string; // Clase CSS para la mitad izquierda/superior
  colorTwo: string; // Clase CSS para la mitad derecha/inferior
}

export default function FormBoard({ setFormBoard }: Props) {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const queryTheme = useQuery({ queryKey: ['themes'], queryFn: getThemes })
  const [selectedId, setSelectedId] = useState<string>(queryTheme?.data ? queryTheme.data[0] : "1");

  const handleSelect = (theme: ThemeOption) => {
    setSelectedId(theme.id);
  };

  const queryClient = useQueryClient();


  const containerRef = useRef<HTMLDivElement>(null);
  const setClose = () => {
      setFormBoard(false);
  }
  useHandleClick(containerRef, setClose);

  const boardMutation = useMutation({
    mutationFn: (title: string) => postBoard(title, selectedId),
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
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
    <div ref={containerRef} className="bg-gray-6 text-gray-4 w-80 absolute top-0 -left-2 border-gray-5 border rounded-lg z-50">
      <div className="w-full flex px-4 justify-between items-center">
        <p className="text-sm py-4 px-2">Create Board</p>
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 justify-center px-4 pb-4 mb-2">
          <div>
            {/* Escoger colores */}
            <div className="w-full max-w-xs px-2 rounded-lg">
              <p className="text-xs font-semibold text-gray-3 mb-1">Color de fondo</p>

              {/* Grid de 3 columnas */}
              <div className="grid grid-cols-3 gap-2">
                {queryTheme.data && queryTheme.data.map((theme) => {
                  const isSelected = selectedId === theme.id;
                  console.log(theme);
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelect(theme)}
                      className={`relative h-12 w-full rounded-md overflow-hidden transition-all duration-200 focus:outline-none hover:scale-105 
                        ${ isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-5' : 'opacity-90 hover:opacity-100'}
                        ${ theme.mode == "COLOR" ? `bg-linear-to-r from-[${theme.color_one}] to-[${theme.color_two}]` : '' }
                        ${ theme.mode == "IMAGE" ? `bg-[url('/img/hero.jpg')]` : ''  }
                        `}
                    >
                      <div className="flex h-full w-full">
                        <div className={`w-1/2 h-full ${theme.colorOne}`} />
                        <div className={`w-1/2 h-full ${theme.colorTwo}`} />
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <label htmlFor="board-name" className="self-start px-2 text-xs grid gap-2 mt-4 text-gray-3">
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
