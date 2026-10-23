import { MotionProps } from 'motion/react';

// Mirror the --ease-out / --duration-* CSS tokens in global.css (seconds here).
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
} as const;

export const viewportOpacityMotion = {
  initial: { opacity: 0 },
  whileInView: { opacity: [0, 1] },
  viewport: { once: true },
  transition: { duration: DURATION.base, ease: EASE_OUT },
} satisfies MotionProps;

export const hoverRotateMotion = {
  whileHover: {
    rotate: 360,
    transition: {
      type: 'spring',
      damping: 10,
      mass: 0.75,
      stiffness: 100,
    },
  },
} satisfies MotionProps;

export const createDynamicallyOpacityMotion = (
  isShown: boolean,
  durationMs: number,
) =>
  ({
    initial: 'hidden',
    animate: isShown ? 'show' : 'hidden',
    variants: {
      show: {
        display: 'block',
        opacity: 1,
      },
      hidden: {
        transitionEnd: {
          display: 'none',
        },
        opacity: 0,
      },
    },
    transition: { duration: durationMs / 1000 },
  }) satisfies MotionProps;
