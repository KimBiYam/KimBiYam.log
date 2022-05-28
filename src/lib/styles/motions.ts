import { MotionProps } from 'framer-motion';

export const viewportOpacityMotion: MotionProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: [0, 1] },
  viewport: { once: true },
  transition: { duration: 0.2 },
};

export const hoverRotateMotion: MotionProps = {
  whileHover: {
    rotate: 360,
    transition: {
      type: 'spring',
      damping: 10,
      mass: 0.75,
      stiffness: 100,
    },
  },
};

export const createDynamicallyOpacityMotion = (
  isShown: boolean,
  durationMs: number,
): MotionProps => ({
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
});

export const createRotateScaleMotion = (
  isShown: boolean,
  durationMs: number,
): MotionProps => ({
  initial: 'hidden',
  animate: isShown ? 'show' : 'hidden',
  variants: {
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    hidden: {
      scale: 0,
      rotate: 180,
      opacity: 1,
    },
  },
  transition: { duration: durationMs / 1000 },
});
