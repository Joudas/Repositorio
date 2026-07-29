import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBoardsList } from "@/services/board";
import Header from "../../components/layout/Header/Header";
import Spinner from "@/components/UI/Spinner";
import BoardCard from "./Card/BoardCard";
import BoardCreate from "./Card/BoardCreate";

export default function DashboardScreen() {
  const { data: boards, isLoading, isError } = useQuery({
    queryKey: ["boards"],
    queryFn: getBoardsList,
  });

  if (isLoading) return (
    <div className="w-screen h-screen flex flex-col bg-gray-6">
      <Header />
      <Spinner />
    </div>
  );

  if (isError) return (
    <div className="w-screen h-screen flex flex-col bg-gray-6">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-2 text-lg">Error loading boards. Try again later.</p>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-6">
      <Header />
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-gray-1 text-xl font-bold mb-6">My Boards</h1>

        <div className="flex">
          {boards?.length === 0 ? (
            <>
              <div className="flex flex-col items-center justify-center mt-10 gap-4">
                <p className="text-gray-3 text-lg">No boards yet.</p>
                <p className="text-gray-3 text-sm">Create one using the button above.</p>
              </div>
              <div className="bg-gray-5 w-60 h-32 rounded-md cursor-pointer">
                
              </div>
            </>
            
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {boards?.map((board) => (
                <BoardCard board={board} />
              ))}
              <BoardCreate/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
