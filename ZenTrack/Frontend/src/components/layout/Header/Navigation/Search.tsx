import { useDebounce } from "@/hooks/useDebounce";
import { getBoardsList, type Board } from "@/services/board"
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useHandleClick } from "../../../../features/board/hooks/useHandleClick";
import { IoSearchOutline } from "react-icons/io5";

export default function Search() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);
    const [boards, setBoards] = useState<Board[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [input, setInput] = useState("");
    const debouncedSearchTerm = useDebounce(input, 1000);

    // Click outside to close
    
    const setClose = () => {
        setIsSearching(false);
    }
    
    useHandleClick(containerRef, setClose);
    
    const handleChange = (e: { target: { value: string } }) => {
        setLoading(true);
        setInput(e.target.value);
    };

    useEffect(() => {
        const fetchBoards = async () => {
            if (!debouncedSearchTerm.trim()) return;
            try {
                const response = await getBoardsList();
                const filtered = response.filter((b) =>
                    b.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                );
                setBoards(filtered);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBoards();
    }, [debouncedSearchTerm]);

    const selectBoard = (id: string) => {
        setInput("");
        setIsSearching(false);
        navigate(`/board/${id}`);
    };

    return (
        <div 
        ref={containerRef} 
        className="py-1 px-2 h-8 w-120 text-gray-4 border border-gray-4 flex gap-2 rounded-sm relative focus:border-gray-2 focus:text-gray-2">
            <div className="flex justify-center items-center">
                <IoSearchOutline size="18"/>

            </div>
            <input
                name="name"
                autoComplete="off"
                type="text"
                value={input}
                placeholder="Search"
                className="w-full outline-none text-gray-2"
                onChange={handleChange}
                onClick={() => setIsSearching(true)}
            />
            {isSearching && (
                <div className="w-120 min-h-10 bg-gray-6 absolute top-8 left-0 rounded-sm flex flex-col justify-center items-center py-2 z-50">
                    {loading ? (
                        <p>Loading...</p>
                    ) : boards.length ? (
                        <>
                            <p className="self-start p-4 font-bold text-sm">WorkSpace Found</p>
                            <ul className="w-full">
                                {boards.map((board) => (
                                    <li
                                        key={board.id}
                                        onClick={() => selectBoard(board.id)}
                                        className="flex flex-col w-full items-start min-h-10 rounded-sm p-1 px-4 cursor-pointer hover:bg-gray-4"
                                    >
                                        <p className="font-medium text-sm text-gray-2">{board.name}</p>
                                        <span className="text-gray-3 text-xs">WorkSpace</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No Workspace found</p>
                    )}
                </div>
            )}
        </div>
    );
}
