import { FEED_PATH } from '@src/shared/constants/metadata';

export interface NavItem {
  label: string;
  href: string;
  // Plain <a> instead of next/link (non-page resources such as the RSS feed).
  isExternalResource?: boolean;
  isActive?: (pathname: string) => boolean;
}

// Single source for both the desktop nav and the mobile menu.
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Posts',
    href: '/',
    isActive: (pathname) => pathname === '/' || pathname.startsWith('/tags/'),
  },
  { label: 'RSS', href: FEED_PATH, isExternalResource: true },
];
