import { m, Variants } from 'framer-motion';

export interface PageRoutingAnimationProps {
  children: React.ReactNode;
  className?: string;
}

const variants: Variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageRoutingAnimation = ({
  children,
  className,
}: PageRoutingAnimationProps) => (
  <m.div
    variants={variants}
    initial="hidden"
    animate="enter"
    className={className}
    exit="exit"
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </m.div>
);

export default PageRoutingAnimation;
