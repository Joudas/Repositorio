import { AnimatePresence, motion } from 'motion/react'
import { FaCheckCircle } from 'react-icons/fa';
import { RiCheckboxBlankCircleLine } from 'react-icons/ri';

const iconVariants = {
  initial: { 
    scale: 0.5, 
    opacity: 0, 
    rotate: -45 
  },
  animate: { 
    scale: 1, 
    opacity: 1, 
    rotate: 0,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 15 
    }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0 
  }
};
type Props = {
  check: boolean;
};

export default function AnimationPresenceCheck({check}: Props) {
  return (
    <AnimatePresence mode="wait">
        {check ? (
            <motion.div
            key="checked"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full flex items-center justify-center"
            >
            <FaCheckCircle color="#16DB00" className="w-full h-full" />
            </motion.div>
        ) : (
            <motion.div
            key="unchecked"
            className="w-full h-full flex items-center justify-center"
            >
            <RiCheckboxBlankCircleLine color="white" className="w-full h-full" />
            </motion.div>
        )}
    </AnimatePresence>
  )
}
