import { motion } from "motion/react";
import type { Todo } from "@/type/Todo";

import { useModalStore } from "@/stores/modalStore";

import CheckBox from "./CheckBox";

import { useDraggable } from "@dnd-kit/react";

const textVariants = {
  rest: { x: 0 },
  hover: {
    x: 24,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

type Props = {
  todo: Todo;
}

export default function TodoOverlay({ todo }: Props) {
    const {ref, isDragSource} = useDraggable({
      id: todo.id,
    });

    const openModal = useModalStore((s) => s.open);

    const handleClick = () => {
      openModal(todo);
    };

  return (
    <motion.li 
        ref={ref}
        onClick={handleClick}
        data-todo-id={todo.id}
        initial="rest"
        whileHover={todo.check ? undefined : "hover"}
        className={`
            ${isDragSource ? "opacity-30 scale-95" : ""}
            rounded-md w-full bg-gray-5 text-gray-1 p-2 px-4 cursor-pointer
           hover:bg-gray-4 relative flex items-center overflow-hidden list-none`}
    >
        <CheckBox todoId={todo.id} checked={todo.check} cardId={todo.cardId} />

        <motion.span
        variants={textVariants}
        className={`font-medium w-[90%] wrap-break-word ${todo.check ? "pl-7" : ""}`}
        >
            {todo.title}
        </motion.span>
    </motion.li>
  )
}
