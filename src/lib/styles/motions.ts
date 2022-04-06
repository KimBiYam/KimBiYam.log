import { MotionProps } from 'framer-motion';

const DEFAULT_DURATION = 0.5;

export const opacityMotion: MotionProps = {
  animate: { opacity: [0, 1] },
  transition: { duration: DEFAULT_DURATION },
};

export const slideUpMotion: MotionProps = {
  animate: { y: [20, 0], opacity: [0, 1] },
  transition: { duration: DEFAULT_DURATION },
};

export const slideLeftMotion: MotionProps = {
  animate: { x: [20, 0], opacity: [0, 1] },
  transition: { duration: DEFAULT_DURATION },
};

export const viewPortOpacityMotion: MotionProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: [0, 1] },
  viewport: { once: true },
  transition: { duration: DEFAULT_DURATION },
};

export const createDynamicallyOpacityMotion = (
  isShow: boolean,
  durationMs: number,
): MotionProps => ({
  initial: 'hidden',
  animate: isShow ? 'show' : 'hidden',
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
  isShow: boolean,
  durationMs: number,
): MotionProps => ({
  initial: 'hidden',
  animate: isShow ? 'show' : 'hidden',
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
