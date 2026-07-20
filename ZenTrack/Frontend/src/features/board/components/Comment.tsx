// TansTack
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteComment, getComments, postComment, updateComment } from '@/services/comment';
import type { Todo } from '@/type/Todo';
import { useState } from 'react'
// Icons
import { LiaCommentSolid } from "react-icons/lia";

import { Button } from '@/components/UI';
import type { Comment } from '@/type/Comment';

export default function Comment({todo}: {todo: Todo}) {

    const queryClient = useQueryClient();

    const [inputComment, setInputComments] = useState("");
    const [commentId, setCommentId] = useState("");

    const comments = useQuery({
        queryKey: ["comments", todo!.id],
        queryFn: () => getComments(todo?.id),
        enabled: !!todo,
    });

    const deleteComments = useMutation({
        mutationFn: async (id: string) => {
            await deleteComment(id)
        },
        onSuccess: () => {
            setInputComments("");
            queryClient.invalidateQueries({ queryKey: ['comments', todo!.id] })
        }
    })

    const comment = useMutation({
        mutationFn: async () => {
            if(commentId) return await updateComment(commentId, {
                text: inputComment
            });
            else return await postComment(todo?.id, inputComment);
            
        },
        onSuccess: () => {
            setInputComments("");
            queryClient.invalidateQueries({ queryKey: ['comments', todo!.id] })
        }
    });

    const handleupdate = (com: Comment) => {
        setCommentId(com.id);
        setInputComments(com.text);
    }

    return (
      <>
            <div className="p-10 bg-gray-5 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-3 font-semibold text-md my-1 flex gap-2 items-center">
                        <LiaCommentSolid size="24"/>
                        Comments
                    </label>
                    <textarea
                        value={inputComment}
                        onChange={(e) => setInputComments(e.target.value)}
                        placeholder="Enter a comment"
                        className="w-full bg-gray-6 min-h-10 max-h-80 text-gray-1 rounded-md px-3 py-2 outline-none  focus:ring-1 focus:ring-brand-primary overflow-y-scroll wrap-break-words custom-scroll resize-none"
                    />
                    <div className='h-8 w-14'>
                        <Button onClick={() => comment.mutate()}>Save</Button>
                    </div>
                </div>
                <div className="flex flex-col gap-4 max-h-80 overflow-y-scroll custom-scroll">
                        {
                            Array.isArray(comments.data) && comments?.data.map((com) => (
                                <div key={com.id} >
                                    <div className="textm-sm w-full min-h-10 bg-gray-6 rounded-sm p-2 text-gray-2 wrap-break-words">
                                        {com.text}
                                    </div>
                                    <div>
                                        <div className="text-xs flex gap-2 text-gray-3 font-medium p-2">
                                            <span onClick={() => handleupdate(com)} className="cursor-pointer hover:text-emerald-300">
                                                Edit
                                            </span>
                                            <span onClick={() => deleteComments.mutate(com.id)} className="cursor-pointer hover:text-emerald-300">
                                                Delete
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                            ))
                        }
                        
                </div>
            </div>
        </>  
    );
}
