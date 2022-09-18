import { MotionProps, Transition } from 'framer-motion';

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

const rotateScaleSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 15,
};

export const createRotateScaleMotion = (): MotionProps => ({
  initial: {
    scale: 0,
    opacity: 0,
    rotate: 360,
  },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: rotateScaleSpring,
  },
  exit: {
    scale: 0,
    opacity: 0,
    rotate: 360,
    transition: rotateScaleSpring,
  },
});
