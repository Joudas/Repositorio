import { getThemeById } from "@/services/board";
import Card from "../Card/Card";
import { useQuery } from "@tanstack/react-query";
import { getCardList } from "@/services/card";
import { SlOptions } from "react-icons/sl";
import AddCardForm from "../Card/AddCardForm";
import type { Board } from "@/type/Board";


interface Props {
  board: Board;
  hoverPosition?: { cardId: string; index: number } | null;
}

export default function Main({ board, hoverPosition }: Props) {

  const {data: theme, isLoading} = useQuery({ 
    queryKey: ['theme', board?.id], 
    queryFn: () => getThemeById(board!.themeId)
  })

  const {data: cards} = useQuery({
    queryKey: ["cards", board?.id],
    queryFn: () => getCardList(board!.id),
    enabled: !!board,
  });

  return (
    <div className={`flex flex-1 flex-col gap-4 overflow-hidden bg-cover bg-center bg-no-repeat
      ${ (!isLoading && theme) && theme.id ? "" : "bg-[url('/bg-zentrack.jpg')]" }
      ${ theme && theme.mode == "COLOR" ? `bg-linear-to-r from-[${theme.color_one}] to-[${theme.color_two}]` : '' }
      ${ theme && theme.mode == "IMAGE" ? `bg-[url('/img/hero.jpg')]` : ''  }
    `}>
      <div className="w-full h-14 relative">
        <div className="w-full h-full bg-black opacity-50 absolute z-1"></div>
        <div className="w-full h-full px-6 flex justify-between items-center">
          <p className="text-gray-1 font-semibold text-xl z-2">{board?.name}</p>
          <SlOptions size="28" className="cursor-pointer z-2 text-white hover:text-gray-3"/>
        </div>
      </div>
      <div className="p-4  py-2 flex gap-4">
        
        {
          cards && cards?.map((card) => {
            return <Card card={card} key={card.id} boardId={board!.id} hoverPosition={hoverPosition} />
          })
        }
        {board && <AddCardForm boardId={board.id} />}

      </div>
    </div>
  );
}
