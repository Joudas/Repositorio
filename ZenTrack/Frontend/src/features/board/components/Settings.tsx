import { useAuthStore } from '@/stores/authStore'
import { useHandleClick } from '../hooks/useHandleClick';
import { useRef } from 'react';
import { logoutUser } from '@/services/auth';
const settingsList = [
    {"title": "Switch Acount", "className": "py-2",   },
    {"title": "", "className": " self-center w-[90%] border-b h-0 border-gray-4 py-0 cursor-none hover:bg-gray-6 my-2",   },
    {"title": "Profile", "className": "py-2",   },
    {"title": "Themes", "className": "py-2",   },
    {"title": "Help", "className": "py-2",   },
    {"title": "", "className": " self-center w-[90%] border-b h-0 border-gray-4 py-0 cursor-none hover:bg-gray-6 my-2",   },
    {"title": "Log Out", "className": "py-2", },
]

export default function Settings({setSettings}: {setSettings: React.Dispatch<React.SetStateAction<boolean>>}) {
    
    const user = useAuthStore((set) => set.user);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const setClose = () => setSettings(false)
    useHandleClick(containerRef, setClose);
    
  return (
    <div ref={containerRef} className='absolute w-100 min-h-40 bg-gray-6 top-10 -right-6 py-8 rounded-sm z-10'>
        <p className='text-gray-4 text-sm font-bold px-6'>Acount</p>
        <ul className=' mt-4 text-gray-2 flex flex-col'>
            <li className="px-6 py-2">
                <p>
                    {user?.name}
                </p>
                <span className='text-xm text-gray-4'>
                    {user?.email}
                </span>
            </li>
            {
                settingsList.map((set) => (
                    <>
                        <li className={`cursor-pointer px-6 hover:bg-gray-5 ${set.className}`}  onClick={set.title == "Log Out" ? logoutUser : () => {return}}>{set.title}</li>
                    </>
                ))
            }
        </ul>
    </div>
  )
}
