import { motion } from 'framer-motion';
import { LinkProps } from 'next/link';
import { HTMLAttributes } from 'react';
import { hoverRotateMotion } from '../../lib/styles/motions';
import NoScrollLink from './NoScrollLink';

interface ProfileLinkProps
  extends Pick<LinkProps, 'href'>,
    Pick<HTMLAttributes<HTMLAnchorElement>, 'title'> {
  children: React.ReactNode;
}

const ProfileLink = ({ href, title, children }: ProfileLinkProps) => (
  <NoScrollLink href={href} passHref>
    <a
      className="w-6 h-6 duration-300 fill-current primary-text-hover"
      title={title}
    >
      <motion.div {...hoverRotateMotion}>{children}</motion.div>
    </a>
  </NoScrollLink>
);

export default ProfileLink;
