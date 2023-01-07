import Link, { LinkProps } from 'next/link';

interface NoScrollLinkProps extends Omit<LinkProps, 'scroll'> {
  children: React.ReactNode;
  className?: string;
}

const NoScrollLink = ({
  children,
  ...props
}: NoScrollLinkProps): JSX.Element => (
  <Link scroll={false} {...props}>
    {children}
  </Link>
);

export default NoScrollLink;
