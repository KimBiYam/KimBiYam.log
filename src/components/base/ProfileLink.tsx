import { LinkProps } from 'next/link';
import NoScrollLink from './NoScrollLink';

export type ProfileLinkProps = {
  href: LinkProps['href'];
  children: React.ReactNode;
};

const ProfileLink = ({ href, children }: ProfileLinkProps) => (
  <NoScrollLink href={href} passHref>
    <a className="w-6 h-6 duration-300 fill-current transition-color hover:text-blueGray-200 dark:hover:text-gray-500">
      {children}
    </a>
  </NoScrollLink>
);

export default ProfileLink;
