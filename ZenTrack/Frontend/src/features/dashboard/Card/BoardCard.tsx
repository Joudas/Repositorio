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
  })

  return (
    <div
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)}
    className="bg-gray-5 w-60 h-32 rounded-md cursor-pointer relative" 
    >
      <div className={`w-full overflow-hidden h-[70%] rounded-t-md hover:opacity-80
      ${ (!isLoading && theme) && theme.id ? "" : "bg-[url('/bg-zentrack.jpg')]" }
      ${ theme && theme.mode == "COLOR" ? `bg-linear-to-r from-[${theme.color_one}] to-[${theme.color_two}]` : '' }
      ${ theme && theme.mode == "IMAGE" ? `bg-[url('/img/hero.jpg')]` : ''  }
      `}
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
