import Link from 'next/link';

import type { NavItem } from '../constants/navItems';

interface NavLinkProps {
  item: NavItem;
  pathname: string;
  className: string;
  activeClassName: string;
  onClick?: () => void;
}

const NavLink = ({
  item,
  pathname,
  className,
  activeClassName,
  onClick,
}: NavLinkProps) => {
  const { label, href, isExternalResource, isActive } = item;
  const active = isActive?.(pathname) ?? false;
  const linkClassName = active ? `${className} ${activeClassName}` : className;

  if (isExternalResource) {
    return (
      <a href={href} className={linkClassName} onClick={onClick}>
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={linkClassName}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default NavLink;
