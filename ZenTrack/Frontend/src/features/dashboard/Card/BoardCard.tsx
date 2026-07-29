import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Board } from "@/type/Board"

import { GrFavorite } from "react-icons/gr";
import { useQuery } from "@tanstack/react-query";
import { getThemeById } from "@/services/board";

type Props = {
  board: Board
}
export default function BoardCard({board} : Props) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const {data: theme, isLoading} = useQuery({ 
    queryKey: ['theme', board?.id], 
    queryFn: () => getThemeById(board!.themeId)
  });

  const bgStyle = (!isLoading && theme)
    ? theme.mode === "COLOR" && theme.color_one && theme.color_two
      ? { backgroundImage: `linear-gradient(to bottom right, ${theme.color_one}, ${theme.color_two})` }
      : theme.mode === "IMAGE" && theme.image
        ? { backgroundImage: `url(/${theme.image}.jpg)`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
        : { backgroundImage: "url('/bg-zentrack.jpg')", backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : { backgroundImage: "url('/bg-zentrack.jpg')", backgroundSize: "cover" as const, backgroundPosition: "center" as const };

  return (
    <div
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)}
    className="bg-gray-5 w-60 h-32 rounded-md cursor-pointer relative" 
    >
      <div
      style={bgStyle}
      className="w-full overflow-hidden h-[70%] rounded-t-md hover:opacity-70"
      onClick={() => navigate(`/board/${board.id}`)}>
      </div>
      <div
          key={board.id}
          className="flex justify-between h-[30%] items-center "
        >
          <h2 className="text-gray-1 font-semibold text-sm group-hover:text-white px-2">
            {board.name}
          </h2>
        </div>
        {
          isHovered &&
          <GrFavorite className="absolute top-2 right-2 w-5 h-5" color="white"/>
        }
        
    </div>
  )
}
