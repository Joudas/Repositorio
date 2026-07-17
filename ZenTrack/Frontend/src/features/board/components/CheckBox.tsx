import { motion } from "motion/react";
import { useState } from "react";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";

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

export default function Checkbox({check}: {check: boolean}) {
  const [checked, setChecked] = useState(check);
  
  return (
    <motion.div
      onClick={(e) => { e.stopPropagation(); setChecked(!checked); }}
      variants={checkboxVariants}
      className="absolute left-2 flex items-center justify-center w-5 h-5 rounded-full"
      >
          {
              checked ? 
              <FaCheckCircle color="#16DB00" className="w-full h-full" />
              : 
              <RiCheckboxBlankCircleLine className="w-full h-full" />
          }
      </motion.div>
  );
}