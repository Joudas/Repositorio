import React from 'react'
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbInbox, TbLayoutBoard } from "react-icons/tb";

type Props = {
    setInBox: React.Dispatch<React.SetStateAction<boolean>>;
    inBox: boolean;
    setIsBoard: React.Dispatch<React.SetStateAction<boolean>>;
    isBoard: boolean;
}

export default function InBoxBar({setInBox, inBox, setIsBoard, isBoard}: Props) {
  return (
    <div className='absolute bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2]'>
      <ul className="bg-gray-6 text-gray-2 flex gap-2 justify-between items-center min-w-80 h-12  border border-gray-4 py-6 px-2 rounded-xl m-1">
        <li 
        onClick={() => setInBox(!inBox)} 
        className={`flex justify-center items-center gap-1 cursor-pointer rounded-md p-1 px-3 relative
            ${inBox ? "bg-brand-accent text-[#B3FFEF] hover:bg-brand-accent-strong" : "hover:bg-gray-4 hover:text-gray-1"}`}>
            <TbInbox />
            InBox
            {
              inBox &&
              <span className='border-b border-[#B3FFEF] w-[30%] absolute bottom-1'></span>
            }

            
        </li>
        <li 
        onClick={() => setIsBoard(!isBoard)}
        className={`flex justify-center items-center gap-1 cursor-pointer rounded-md p-1 px-3 relative
            ${isBoard ? "bg-brand-accent text-[#B3FFEF] hover:bg-brand-accent-strong" : "hover:bg-gray-4 hover:text-gray-1"}`}>
            <MdOutlineSpaceDashboard />
            Board
            {
              isBoard &&
              <span className='border-b border-[#B3FFEF] w-[30%] absolute bottom-1'></span>
            }
        </li>
        <li className='border-r border-gray-4 h-6'></li>
        <li 
        className={`flex justify-center items-center gap-1 cursor-pointer rounded-md p-1 px-3 relative
            ${false ? "bg-brand-accent text-[#B3FFEF] hover:bg-brand-accent-strong" : "hover:bg-gray-4 hover:text-gray-1"}`}>
            <TbLayoutBoard />
            Switch Board
            {
              false &&
              <span className='border-b border-[#B3FFEF] w-[30%] absolute bottom-1'></span>
            }
        </li>
      </ul>
    </div>
  )
}
