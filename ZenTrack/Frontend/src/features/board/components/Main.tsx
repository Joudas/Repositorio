import type { Board } from "@/services/board";
import Card from "./Card";
import { useQuery } from "@tanstack/react-query";
import { getCardList } from "@/services/card";
import { SlOptions } from "react-icons/sl";

interface Props {
  board: Board | undefined;
}

export default function Main({ board }: Props) {

  const cards = useQuery({
    queryKey: ["cards", board?.id],
    queryFn: () => getCardList(board!.id),
    enabled: !!board,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden bg-[url('/bg-zentrack.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full h-14 relative">
        <div className="w-full h-full bg-black opacity-50 absolute z-1"></div>
        <div className="w-full h-full px-6 flex justify-between items-center">
          <p className="text-gray-1 font-semibold text-xl z-2">{board?.name}</p>
          <SlOptions size="28" className="cursor-pointer z-2 text-white hover:text-gray-3"/>
        </div>
      </div>
      <div className="p-4  py-2 flex gap-4">
        
        {
          cards && cards?.data?.map((card) => {
            return <Card card={card} key={card.id}/>
          })
        }
      </div>
    </div>
  );
}
