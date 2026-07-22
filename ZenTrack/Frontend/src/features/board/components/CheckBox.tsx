import { motion } from "motion/react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Todo } from "@/type/Todo";
import AnimationPresenceCheck from "./AnimationPresenceCheck";

type Props = {
  toggleMutation: UseMutationResult<Todo, Error, void, {
      previous: Todo[] | undefined;
  }>
  check: boolean;
};


const checkboxVariants = {
  rest: {
    opacity: 0,
    x: -20,
    scale: 0.8,
  },
  hover: {
    opacity: 1,
    x: 4,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

export default function Checkbox({ check, toggleMutation }: Props) {



  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        toggleMutation.mutate();
      }}
      variants={checkboxVariants}
      className="absolute left-2 flex items-center justify-center w-5 h-5 rounded-full"
      >
        <AnimationPresenceCheck check={check} />
    </motion.div>
  );
}