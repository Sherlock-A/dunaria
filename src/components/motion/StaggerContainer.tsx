"use client";
import { motion } from "framer-motion";
import { staggerContainerVariants, cardGridVariants } from "@/lib/motion";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "section";
  variant?: "default" | "cards";
}

export function StaggerContainer({
  children,
  className,
  as = "div",
  variant = "default",
}: StaggerContainerProps) {
  const variants = variant === "cards" ? cardGridVariants : staggerContainerVariants;
  const sharedProps = {
    variants,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: 0.05 },
    className,
  };

  if (as === "ul") return <motion.ul {...sharedProps}>{children}</motion.ul>;
  if (as === "ol") return <motion.ol {...sharedProps}>{children}</motion.ol>;
  if (as === "section") return <motion.section {...sharedProps}>{children}</motion.section>;
  return <motion.div {...sharedProps}>{children}</motion.div>;
}
