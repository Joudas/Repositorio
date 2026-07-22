import { useRef, useState, useEffect } from 'react'
import { FormBoard, Search, Settings } from "../../features/board/components/Navigation";

interface HeaderProps {
  showCreateBoard?: boolean;
}

export default function Header({ showCreateBoard = true }: HeaderProps) {

    const headerRef = useRef<HTMLDivElement>(null);
    const [formBoard, setFormBoard] = useState(false);
    const [setting, setSettings] = useState(false);

    // Cerrar menús al hacer click fuera del header
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
                setFormBoard(false);
                setSettings(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <div ref={headerRef} className='h-12 bg-gray-6 flex w-screen justify-between items-center px-8'>
        <p className='text-gray-1 text-2xl font-bold'>ZenTrack</p>
        <div className='flex gap-4'>
            <Search/>
            {showCreateBoard && (
              <>
                <div className='w-20 h-8 flex items-center'>
                    <button
                        onClick={() => setFormBoard(true)}
                        className="bg-brand-primary w-full h-full cursor-pointer text-white rounded-sm font-bold mt-1"
                    >
                        Create
                    </button>
                </div>
                <div className='relative'>
                    {
                        formBoard && 
                        <FormBoard setFormBoard={setFormBoard}/>
                    }
                </div>
              </>
            )}
        </div>
        <div className="flex gap-4 text-gray-1 items-center relative">
            <div className='cursor-pointer' onClick={() => setSettings(true)}>
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 7H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M14 17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            
            {
                setting && 
                <Settings setSettings={setSettings}/>
            }
        </div>
    </div>
  )
}
