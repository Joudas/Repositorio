import { motion } from "motion/react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, ...props }: Props) => {
  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      className="relative overflow-hidden bg-brand-primary w-full h-full cursor-pointer text-white rounded-sm font-bold mt-1"
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <span className="relative z-10">{children}</span>

      <motion.div
        variants={{
          initial: { x: "-110%", skewX: -20 },
          hover: { x: "-10%", skewX: -20 },
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[150%] h-full bg-brand-secondary origin-left z-0"
      />
    </motion.button>
  );
};
