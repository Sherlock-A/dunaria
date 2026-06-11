"use client";
import { motion } from "framer-motion";

interface ScaleOnHoverProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function ScaleOnHover({ children, className, scale = 1.025 }: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
