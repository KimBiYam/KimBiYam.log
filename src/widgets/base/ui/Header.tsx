'use client';

import { usePathname } from 'next/navigation';

import { Logo, DarkModeButton } from '@src/shared';

import { NAV_ITEMS } from '../constants/navItems';
import HeaderTitle from './HeaderTitle';
import MobileMenu from './MobileMenu';
import NavLink from './NavLink';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-2 md:px-6 md:pt-4">
      <div className="relative max-w-[1040px] mx-auto">
        <div className="flex items-center h-14 gap-3 pl-4 pr-1.5 border md:h-[60px] md:gap-6 md:pl-[22px] md:pr-2 rounded-[18px] border-line glass-panel">
          <Logo />
          <HeaderTitle />
          <nav
            aria-label="주요 메뉴"
            className="flex gap-4 text-sm font-medium xs:hidden md:gap-6 text-muted"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                className="flex items-center h-11 px-1 rounded-md transition-colors duration-300 hover:text-foreground focus-ring"
                activeClassName="text-foreground"
              />
            ))}
          </nav>
          <MobileMenu pathname={pathname} />
          <DarkModeButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
