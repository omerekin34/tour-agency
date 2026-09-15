/** Premium easing — slow start, crisp finish */
export const luxuryEase = [0.32, 0.72, 0, 1] as const;

export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.42, ease: luxuryEase },
} as const;

export const hoverLift = {
  y: -5,
  scale: 1.012,
  duration: 0.38,
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
