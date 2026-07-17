import { motion } from "motion/react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SocialButton = ({ children, ...props }: Props) => {
  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      className="relative overflow-hidden group h-12 w-full border border-brand-muted rounded-sm p-3 cursor-pointer flex items-center justify-center gap-4 font-bold"
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <motion.div
        variants={{
          initial: { x: "-110%", skewX: -20 },
          hover: { x: "-10%", skewX: -20 },
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[150%] h-full bg-brand-dark z-0"
      />
      <motion.span
        variants={{
          initial: { color: "var(--color-brand-dark)" },
          hover: { color: "var(--gray-1)" },
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="relative z-10 flex items-center justify-center gap-4 w-full h-full"
      >
        {children}
      </motion.span>
    </motion.button>
  );
};
