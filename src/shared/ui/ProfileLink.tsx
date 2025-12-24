
import type { HTMLAttributes } from 'react';

import { domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import { hoverRotateMotion } from '@src/shared/styles/motions';

interface ProfileLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const ProfileLink = ({ href, title, children }: ProfileLinkProps) => (
  <a
    href={href}
    className="w-6 h-6 mr-3 duration-300 fill-current primary-text-hover"
    title={title}
  >
    <LazyMotion features={domAnimation} strict>
      <m.div {...hoverRotateMotion}>{children}</m.div>
    </LazyMotion>
  </a>
);

export default ProfileLink;
