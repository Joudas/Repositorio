"use client"
import { Plus } from 'lucide-react';
import { useState } from 'react'
import FormLinks from './FormLinks';
import { Link } from "@prisma/client";

export default function LeftContent({ getLink }: { getLink: Link[] }) {
    const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="lg:col-span-3 flex flex-col gap-6 pb-20">
        <h1 className="text-2xl font-bold text-gray-900">Mis Enlaces</h1>
        
        {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="cursor-pointer w-full bg-charcola text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[#0E6251] transition-colors shadow-sm">
            <Plus size={20} /> Add New Link
            </button>
        )}

        <FormLinks isAdding={isAdding} setIsAdding={setIsAdding} getLink={getLink} />
    </div>
  )
}
