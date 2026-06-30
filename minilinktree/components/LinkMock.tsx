"use client"
import Image from 'next/image';
import { FaLink } from "react-icons/fa";
import { Link as LK } from "@prisma/client";
import Link from 'next/link';

export default function LinkMock({ link }: { link: LK }) {
  return (
    <Link href={link.url} target="_blank" rel="noopener noreferrer" className={`bg-white border cursor-pointer border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group w-full h-16`}>
        {link.imageUrl ? (
        <div className="relative w-6 h-6 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={link.imageUrl} alt={link.title} fill className="object-cover" />
        </div>
        ) : (
        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <FaLink size={16} className="text-gray-400" />
        </div>
        )}
        
        <div className="flex-1 overflow-hidden">
        <h3 className={`font-semibold text-sm ${!link.isActive ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
            {link.title}
        </h3>
        <p className="text-gray-500 text-[10px] truncate">{link.url}</p>
        </div>
    </Link>
  )
}

