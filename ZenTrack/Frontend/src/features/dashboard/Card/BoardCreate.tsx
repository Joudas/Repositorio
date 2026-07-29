import { FormBoard } from "@/components/layout/Header/Navigation";
import { useState } from "react";

export default function BoardCreate() {
    const [isForm, isSetForm] = useState(false);
    
  return (
    <>
        <div className="bg-gray-5 hover:bg-gray-4 w-60 h-32 rounded-md cursor-pointer flex justify-center items-center"
        onClick={() => isSetForm(!isForm)} >
            <p className="text-gray-6">
                Create A New Board
            </p>
        </div>
        {
            isForm &&
            <div className="relative">
                <div className="absolute">
                    <FormBoard setFormBoard={isSetForm} />
                </div>
            </div>
        }
        
    </>
  )
}
