import { motion } from "motion/react";

import type { Todo } from "@/type/Todo";

import { useModalStore } from "@/stores/modalStore";

import CheckBox from "./CheckBox";

import { useDraggable } from "@dnd-kit/react";

const containerVariants = {
  rest: {},
  hover: {},
};
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
    const id = todo.id;
    const {ref, isDragSource} = useDraggable({
      id,
    });

    const openModal = useModalStore((s) => s.open);

    const handleClick = () => {
      openModal(todo);
    };

  return (
    <motion.li 
        ref={ref}
        onClick={handleClick}
        variants={containerVariants}
        initial="rest"
        whileHover="hover"
        className={`
            ${isDragSource && "border-2 border-brand-muted rotate-2 transform"}
            rounded-md w-full bg-gray-5 text-gray-1 p-2 px-4 cursor-pointer
           hover:bg-gray-4 relative flex items-center overflow-hidden list-none`}
    >
        <CheckBox check={todo.check}/>

        <motion.span
        variants={textVariants}
        className="font-medium w-[90%] wrap-break-word"
        >
            {todo.title}
        </motion.span>
    </motion.li>
  )
}
