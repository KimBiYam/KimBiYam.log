import { MotionProps } from 'motion/react';

export const viewportOpacityMotion = {
  initial: { opacity: 0 },
  whileInView: { opacity: [0, 1] },
  viewport: { once: true },
  transition: { duration: 0.2 },
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
