/** Premium easing — slow start, crisp finish */
export const luxuryEase = [0.32, 0.72, 0, 1] as const;

export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.42, ease: luxuryEase },
} as const;

export const hoverLift = {
  y: -6,
  scale: 1.014,
  duration: 0.45,
} as const;

/** Tur kartı hover gölgesi (Framer Motion boxShadow) */
export const cardHoverShadow = {
  rest: "0 4px 14px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.04)",
  hover:
    "0 28px 56px -16px rgba(15, 23, 42, 0.22), 0 12px 24px -8px rgba(212, 175, 55, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.28)",
} as const;

export const scrollRevealHidden = {
  opacity: 0,
  y: 28,
  scale: 0.985,
} as const;

export const scrollRevealVisible = {
  opacity: 1,
  y: 0,
  scale: 1,
} as const;
