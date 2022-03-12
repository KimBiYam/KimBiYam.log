import { MotionProps } from 'framer-motion';

const DEFAULT_DURATION = 0.5;

export const slideUpMotion: MotionProps = {
  animate: { y: [20, 0], opacity: [0, 1] },
  transition: { duration: DEFAULT_DURATION },
};

export const slideLeftMotion: MotionProps = {
  animate: { x: [20, 0], opacity: [0, 1] },
  transition: { duration: DEFAULT_DURATION },
};

export const viewPointSlideUpMotion: MotionProps = {
  initial: { opacity: 0 },
  whileInView: { y: [20, 0], opacity: [0, 1] },
  viewport: { once: true },
  transition: { duration: DEFAULT_DURATION },
};

export const generateDialogMotion = (
  isOpen: boolean,
  duration: number,
): MotionProps => ({
  initial: 'closed',
  animate: isOpen ? 'open' : 'closed',
  variants: {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  },
  transition: { duration },
});
