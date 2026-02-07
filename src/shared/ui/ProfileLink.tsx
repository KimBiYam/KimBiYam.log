'use client';

import { HTMLAttributes } from 'react';

import Link, { LinkProps } from 'next/link';

import * as m from 'motion/react-m';

import { hoverRotateMotion } from '@src/shared/styles/motions';

interface ProfileLinkProps
  extends Pick<LinkProps, 'href'>,
    Pick<HTMLAttributes<HTMLAnchorElement>, 'title'> {
  children: React.ReactNode;
}

const ProfileLink = ({ href, title, children }: ProfileLinkProps) => (
  <Link
    href={href}
    passHref
    className="w-6 h-6 mr-3 duration-300 fill-current primary-text-hover"
    title={title}
  >
    <m.div {...hoverRotateMotion}>{children}</m.div>
  </Link>
);

export default ProfileLink;
