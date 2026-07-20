import { useRef, useState } from "react";

import { FaPlus } from "react-icons/fa";
import { useHandleClick } from "../hooks/useHandleClick";

import { IoCloseSharp } from "react-icons/io5";
import { Button } from "@/components/UI";

export default function AddCardForm() {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [isAdding, setIsAdding] = useState(false);

    const setClose = () => {
        setIsAdding(false);
    }
        
    useHandleClick(containerRef, setClose);
  return (
    <>
    {
        isAdding ? 
        <div 
        ref={containerRef}
        className="bg-gray-6 min-h-12 w-68 rounded-lg p-2 pb-3 flex flex-col gap-1 self-start"> 
            <input type="text" name="" id="" 
            autoFocus
            placeholder="Enter a title card"
            className="text-gray-1 rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-brand-primary "/>
            <div className="flex justify-between items-end">
                <div className="w-20 h-8 text-sm">
                    <Button>Add Card</Button>
                </div>
                <span className="cursor-pointer" onClick={() => setIsAdding(false)}>
                    <IoCloseSharp color="white" size="20"/>
                </span>
            </div>
        </div>
        :
        <button 
        onClick={() => setIsAdding(true)} 
        className="w-10 h-40 rounded-md flex flex-col gap-2 justify-center items-center bg-gray-1/40 hover:bg-gray-1/60 cursor-pointer">
            <FaPlus color="white"/>
            <span className="text-white [writing-mode:vertical-rl] cursor-pointer font-semibold">Add a Card</span>
        </button>
    }
    </>
  )
}
