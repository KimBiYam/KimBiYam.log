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

export const hoverLiftMotion: MotionProps = {
  whileHover: {
    y: [0, -5],
    x: [0, -10],
    transition: {
      type: 'spring',
      duration: 0.3,
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

export const createRotateScaleMotion = (isShown: boolean): MotionProps => ({
  initial: 'hidden',
  animate: isShown ? 'show' : 'hidden',
  variants: {
    show: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: rotateScaleSpring,
    },
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: 360,
      transition: rotateScaleSpring,
    },
  },
});
