import { motion } from "motion/react";
import type { Todo as TodoType } from "@/type/Todo";

import { useModalStore } from "@/stores/modalStore";

import CheckBox from "./CheckBox";

import { useDraggable } from "@dnd-kit/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "@/services/todo";
import type { Todo } from "@/type/Todo";

const textVariants = {
  rest: { x: 0 },
  hover: {
    x: 24,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

type Props = {
  todo: TodoType;
}

export default function Todo({ todo }: Props) {
  const queryClient = useQueryClient();
  
  const {ref, isDragSource} = useDraggable({
    id: todo.id,
  });

  const openModal = useModalStore((s) => s.open);

  const handleClick = () => {
    openModal(todo);
  };

  const toggleMutation = useMutation({
    mutationFn: () => updateTodo(todo.id, { check: !todo.check }),
    onMutate: async () => {
      // Optimistic update: cambiar el check inmediatamente en el cache
      const previous = queryClient.getQueryData<Todo[]>(["todos", todo.cardId]);
      queryClient.setQueryData<Todo[]>(["todos", todo.cardId], (old) =>
        old?.map((t) => (t.id === todo.id ? { ...t, check: !todo.check } : t))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Rollback si la API falla
      if (context?.previous) {
        queryClient.setQueryData(["todos", todo.cardId], context.previous);
      }
    },
  });

  return (
    <motion.li 
      ref={ref}
      onClick={handleClick}
      data-todo-id={todo.id}
      initial="rest"
      animate={todo.check ? "hover" : "rest"}
      whileHover={todo.check ? undefined : "hover"}
      className={`
          rounded-md w-full bg-gray-5 text-gray-1 p-2 px-4 cursor-pointer
          hover:bg-gray-4 relative flex items-center overflow-hidden list-none
          ${isDragSource ? "opacity-35 border-brand-accent border-2" : ""}`}
    >

      <CheckBox 
      check={todo.check} 
      toggleMutation={toggleMutation} />

      <motion.span
      variants={textVariants}
      className={`font-medium w-[90%] wrap-break-word pl-2`}
      >
          {todo.title}
      </motion.span>
    </motion.li>
  )
}
