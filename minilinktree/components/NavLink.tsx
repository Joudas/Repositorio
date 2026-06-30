"use client"
import clsx from "clsx";
import { usePathname } from "next/dist/client/components/navigation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePhonelinkSetup } from "react-icons/md";

export default function NavLink() {
    const pathname = usePathname();
  return (
    <div className="flex flex-col gap-4">
        <Link
            href="/dashboard"
            className={clsx("p-2 links rounded-md flex items-center gap-2", {
            "bg-gray-200 font-semibold": pathname === "/dashboard" || pathname?.startsWith("/dashboard/") && !pathname?.startsWith("/dashboard/perfil") && !pathname?.startsWith("/dashboard/settings"),
            })}
        >
            <MdOutlinePhonelinkSetup size={20} />
            <span>My Links</span>
        </Link>

        <Link
            href="/profile"
            className={clsx("p-2 links rounded-md flex items-center gap-2", {
            "bg-gray-200 font-semibold": pathname === "/profile" || pathname?.startsWith("/profile/"),
            })}
        >
            <CgProfile size={20} />
            <span>Profile</span>
        </Link>

        <Link
            href="/settings"
            className={clsx("p-2 links rounded-md flex items-center gap-2", {
            "bg-gray-200 font-semibold": pathname === "/settings" || pathname?.startsWith("/settings/"),
            })}
        >
            <IoSettingsOutline size={20} />
            <span>Settings</span>
        </Link>
    </div>
  )
}
