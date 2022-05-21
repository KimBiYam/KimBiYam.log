import { motion } from 'framer-motion';

export interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

const PageTransitionWrapper = ({ children }: PageTransitionWrapperProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: 0, y: 35 },
      enter: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, x: 0, y: 35 },
    }}
    initial="hidden"
    animate="enter"
    exit="exit"
    transition={{ duration: 0.45, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

export default PageTransitionWrapper;
