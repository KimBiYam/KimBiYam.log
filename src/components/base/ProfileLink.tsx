import { memo } from 'react';
import Link, { LinkProps } from 'next/link';

export type ProfileLinkProps = {
  href: LinkProps['href'];
  children: React.ReactNode;
};

const ProfileLink = ({ href, children }: ProfileLinkProps) => (
  <Link href={href} passHref>
    <a className="w-7 h-7">{children}</a>
  </Link>
);

export default ProfileLink;
