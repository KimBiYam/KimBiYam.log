import { motion } from 'framer-motion';
import { LinkProps } from 'next/link';
import { hoverRotateMotion } from '../../lib/styles/motions';
import NoScrollLink from './NoScrollLink';

export type ProfileLinkProps = {
  href: LinkProps['href'];
  children: React.ReactNode;
};

const ProfileLink = ({ href, children }: ProfileLinkProps) => (
  <NoScrollLink href={href} passHref>
    <a className="w-6 h-6 duration-300 fill-current primary-text-hover">
      <motion.div {...hoverRotateMotion}>{children}</motion.div>
    </a>
  </NoScrollLink>
);

export default ProfileLink;
