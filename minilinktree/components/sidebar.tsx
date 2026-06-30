import ButtonSignOut from './buttonSignOut'
import NavLink from '@/components/NavLink'
import Image from 'next/image'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-basic border p-4 m-2 aside rounded-md flex flex-col justify-between">
        <nav className="flex flex-col gap-2">
            <div className="grid justify-center">
            <Image src="/mini_tree.webp" alt="Logo" width={100} height={50} />
            <h2 className="text-xl font-bold mb-6 text-charcola ">Mini-Linktree</h2>
            </div>
            <NavLink />
        </nav>
            <ButtonSignOut />
    </aside>
  )
}
