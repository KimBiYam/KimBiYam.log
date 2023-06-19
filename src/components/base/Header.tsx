import { memo } from 'react';

import { m } from 'framer-motion';

import HeaderButtonSection from './HeaderButtonSection';
import HeaderDesktopNav from './HeaderDesktopNav';
import HeaderTitle from './HedaerTitle';
import Logo from './Logo';

const Header = () => {
  return (
    <m.header className="fixed z-50 flex items-center w-full h-14 bg-inherit">
      <div className="container flex items-center h-full max-w-screen-md px-4 md:px-8 ">
        <Logo />
        <HeaderTitle />
        <HeaderDesktopNav />
        <HeaderButtonSection />
      </div>
    </m.header>
  );
};

export default memo(Header);
