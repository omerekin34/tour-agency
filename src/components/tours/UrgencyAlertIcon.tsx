"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type UrgencyAlertIconProps = {
  tone: "amber" | "gold";
  className?: string;
};

export default function UrgencyAlertIcon({
  tone,
  className,
}: UrgencyAlertIconProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-xl",
        tone === "amber"
          ? "bg-amber-500/15 text-amber-700"
          : "bg-gold-500/15 text-gold-700",
        className,
      )}
      aria-hidden
    >
      {!reduceMotion && (
        <motion.span
          className={cn(
            "absolute inset-1 rounded-lg opacity-40",
            tone === "amber" ? "bg-amber-400" : "bg-gold-400",
          )}
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.08, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.span
        className={cn(
          "relative z-10 select-none font-serif text-[1.65rem] font-bold leading-none",
          tone === "amber" ? "text-amber-700" : "text-gold-700",
        )}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.14, 1],
                y: [0, -1, 0],
              }
        }
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        !
      </motion.span>
    </div>
  );
}
