import { ReactNode } from 'react';
import * as m from 'motion/react-m';

import { viewportOpacityMotion } from '@src/shared/styles/motions';

interface FadeInOnViewProps {
  as: 'li' | 'section';
  fadeIn?: boolean;
  className?: string;
  'aria-label'?: string;
  children: ReactNode;
}

// Renders a plain element unless fadeIn is set: skips motion setup for items
// that are already visible on first paint.
const FadeInOnView = ({
  as: tag,
  fadeIn = false,
  children,
  ...props
}: FadeInOnViewProps) => {
  if (!fadeIn) {
    const Tag = tag;

    return <Tag {...props}>{children}</Tag>;
  }

  const MotionTag = tag === 'li' ? m.li : m.section;

  return (
    <MotionTag {...props} {...viewportOpacityMotion}>
      {children}
    </MotionTag>
  );
};

export default FadeInOnView;
