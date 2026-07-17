import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBoardById } from "@/services/board";
import Header from "./components/Header";
import InBox from "./components/InBox";
import Main from "./components/Main";
import InBoxBar from "./components/InBoxBar";
import { useState } from "react";

export default function BoardScreen() {
  const { id } = useParams<{ id: string }>();

  const [inBox, setInBox] = useState(true);
  const [isBoard, setIsBoard] = useState(true);

  const { data: board } = useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoardById(id!),
    enabled: !!id,
  });

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden relative">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {
          inBox && 
          <div className={`${isBoard ? "" : "w-full"}`}>
            <InBox isBoard={isBoard} board={board}/>
          </div>
        }
        {
          isBoard &&
          <Main board={board} />
        }
      </div>
      <InBoxBar 
      setInBox={setInBox} 
      inBox={inBox}
      setIsBoard={setIsBoard}
      isBoard={isBoard}/>
    </div>
  );
}
