import { motion } from 'framer-motion';
import Link, { LinkProps } from 'next/link';
import { HTMLAttributes } from 'react';
import { hoverRotateMotion } from '../../lib/styles/motions';

interface ProfileLinkProps
  extends Pick<LinkProps, 'href'>,
    Pick<HTMLAttributes<HTMLAnchorElement>, 'title'> {
  children: React.ReactNode;
}

const ProfileLink = ({ href, title, children }: ProfileLinkProps) => (
  <Link href={href} passHref>
    <a
      className="w-6 h-6 mr-3 duration-300 fill-current primary-text-hover"
      title={title}
    >
      <motion.div {...hoverRotateMotion}>{children}</motion.div>
    </a>
  </Link>
);

export default ProfileLink;
