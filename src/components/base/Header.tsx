import { memo } from 'react';

import { m } from 'framer-motion';
import { useAtomValue } from 'jotai';

import scrollAtom from '../../atoms/scrollAtom';
import { ScrollDirection } from '../../constants';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';
import HeaderButtonSection from './HeaderButtonSection';
import HeaderDesktopNav from './HeaderDesktopNav';
import Logo from './Logo';

const VISIBLE_TRANSITION_MS = 100;
const HEADER_HEIGHT = 32;

const Header = () => {
  const { direction, pageY, isRouting } = useAtomValue(scrollAtom);
  const isShown = pageY < HEADER_HEIGHT / 2 || direction === ScrollDirection.up;

  return (
    <m.header
      className="fixed z-50 flex items-center w-full h-14 bg-inherit"
      {...createDynamicallyOpacityMotion(
        isShown,
        isRouting ? 0 : VISIBLE_TRANSITION_MS,
      )}
    >
      <div className="container flex items-center justify-between h-full px-4 max-w-screen-md md:px-8 ">
        <Logo />
        <HeaderDesktopNav />
        <HeaderButtonSection />
      </div>
    </m.header>
  );
};

export default memo(Header);
