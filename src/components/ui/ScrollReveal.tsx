"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  luxuryEase,
  scrollRevealHidden,
  scrollRevealVisible,
} from "@/lib/motion-presets";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 28,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-72px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={
        reduceMotion ? false : { ...scrollRevealHidden, y: y ?? scrollRevealHidden.y }
      }
      animate={
        reduceMotion || inView
          ? { ...scrollRevealVisible, y: 0 }
          : { ...scrollRevealHidden, y: y ?? scrollRevealHidden.y }
      }
      transition={{ duration: 0.55, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type ScrollRevealItemProps = ScrollRevealProps & {
  index?: number;
};

export function ScrollRevealItem({
  children,
  className,
  index = 0,
  delay,
  y = 32,
}: ScrollRevealItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-64px" });
  const reduceMotion = useReducedMotion();
  const itemDelay = delay ?? 0.06 + index * 0.08;

  return (
    <motion.div
      ref={ref}
      initial={
        reduceMotion ? false : { ...scrollRevealHidden, y: y ?? scrollRevealHidden.y }
      }
      animate={
        reduceMotion || inView
          ? { ...scrollRevealVisible, y: 0 }
          : { ...scrollRevealHidden, y: y ?? scrollRevealHidden.y }
      }
      transition={{ duration: 0.5, delay: itemDelay, ease: luxuryEase }}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
}
