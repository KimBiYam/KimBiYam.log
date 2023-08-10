'use client';

import { m } from 'framer-motion';

export interface PageRoutingAnimationProps {
  children: React.ReactNode;
  className?: string;
}

const PageRoutingAnimation = ({
  children,
  className,
}: PageRoutingAnimationProps) => (
  <m.div
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease: 'easeInOut' }}
  >
    {children}
  </m.div>
);

export default PageRoutingAnimation;
