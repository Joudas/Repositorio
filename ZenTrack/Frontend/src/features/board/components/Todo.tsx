import { motion } from "motion/react";
import { useModalStore } from "@/stores/modalStore";
import { type Todo } from "@/services/todo";
import CheckBox from "./CheckBox";

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

export default function Todo({ todo }: Props) {
    const openModal = useModalStore((s) => s.open);

    const handleClick = () => {
      openModal(todo);
    };

  return (
    <motion.li 
        onClick={handleClick}
        variants={containerVariants}
        initial="rest"
        whileHover="hover"
        className="rounded-md w-full bg-gray-5 text-gray-1 p-2 px-4 cursor-pointer hover:bg-gray-4 relative flex items-center overflow-hidden list-none"
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
