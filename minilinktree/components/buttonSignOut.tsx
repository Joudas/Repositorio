"use client"
import { useSignOut } from '@/hooks/useSignOut'

export default function ButtonSignOut() {
    const {handleSignOut} = useSignOut();

  return (
    <div>
        <button 
        onClick={handleSignOut}
        className="bg-charcola border-charcola text-white cursor-pointer text-white font-bold py-2 px-4 border rounded-sm w-full">
            Sign Out
        </button>
    </div>
  )
}

