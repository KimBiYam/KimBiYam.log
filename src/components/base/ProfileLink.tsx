import Link, { LinkProps } from 'next/link';

export type ProfileLinkProps = {
  href: LinkProps['href'];
  children: React.ReactNode;
};

const ProfileLink = ({ href, children }: ProfileLinkProps) => (
  <Link href={href} passHref>
    <a className="w-6 h-6 duration-300 fill-current transition-color hover:text-blueGray-200 dark:hover:text-gray-500">
      {children}
    </a>
  </Link>
);

export default ProfileLink;
