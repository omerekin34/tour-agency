"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { hoverLift, luxuryEase } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

type LuxuryHoverCardProps = Omit<HTMLMotionProps<"div">, "ref"> & {
  as?: "div" | "article";
};

export function LuxuryHoverCard({
  as = "div",
  className,
  children,
  ...rest
}: LuxuryHoverCardProps) {
  const reduceMotion = useReducedMotion();
  const Component = as === "article" ? motion.article : motion.div;

  return (
    <Component
      initial={false}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: hoverLift.y,
              scale: hoverLift.scale,
              transition: { duration: hoverLift.duration, ease: luxuryEase },
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.992 }}
      className={cn("h-full", className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
