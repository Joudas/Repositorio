import { useState } from 'react'
import { Button } from "@/components/UI";
import { IoIosClose } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postTodo } from '@/services/todo';

type Props = {
    setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
    isAdd: boolean;
    cardId:string;
}

export default function TodoAdd({cardId, setIsAdd, isAdd} : Props) {

    const queryClient = useQueryClient();

    const [inputAdd, setInputAdd] = useState("");

    const addTodo = useMutation({
        mutationFn: () => postTodo(cardId, inputAdd),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos', cardId] })
    });

    const handleClick = () => {
        addTodo.mutate();
        setIsAdd(false);
        setInputAdd("");
    }

    const closeAdd = () => {
        setIsAdd(false);
        setInputAdd("");
    }

  return (
    <div>
        {
            isAdd ? 
                <>
                    <textarea 
                    className="w-full min-h-12 max-h-25 py-2 px-4 bg-gray-5 text-gray-1 rounded-md focus:outline-none resize-none overflow-y-scroll wrap-break-words custom-scroll"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                    placeholder="Enter a title Todo"
                    value={inputAdd}
                    onChange={(e) => setInputAdd(e.target.value)}
                    />
                    <div className='flex justify-between items-center h-8 mb-1 '>
                        <div className='h-full w-30 '>
                            <Button
                            onClick={handleClick}
                            disabled={!inputAdd.trim()}>
                                Add Todo 
                            </Button>
                        </div>
                        <span className='text-white cursor-pointer' onClick={closeAdd}>
                            <IoIosClose size="2.5em"/>
                        </span>
                    </div>
                </>
            :
                <button 
                onClick={() => setIsAdd(true)}
                className="rounded-sm hover:bg-gray-4 w-full h-full px-2 py-2 cursor-pointer text-gray-1 text-left flex items-center gap-1">
                    <GoPlus size="1.5em"/>
                    Add Todo
                </button>
        }
    </div>
  )
}
