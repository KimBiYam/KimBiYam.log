export const slideUpMotion = {
  animate: { y: [20, 0], opacity: [0, 1] },
  transition: { duration: 0.5 },
};

export const slideLeftMotion = {
  animate: { x: [20, 0], opacity: [0, 1] },
  transition: { duration: 0.5 },
};

export const viewPointSlideUpMotion = {
  initial: { opacity: 0 },
  whileInView: { ...slideUpMotion.animate },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export const dialogMotion = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};
