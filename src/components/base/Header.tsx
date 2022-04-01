import { memo } from 'react';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import HeaderMenu from './HeaderMenu';
import DarkModeButton from './DarkModeButton';
import scrollState from '../../atoms/scrollState';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';
import { ScrollDirection } from '../../constants';
import Logo from './Logo';
import HeaderDesktopNav from './HeaderDesktopNav';

const VISIBLE_TRANSITION_MS = 100;

const Header = () => {
  const { direction } = useRecoilValue(scrollState);

  return (
    <motion.header
      className="fixed z-50 flex items-center w-full h-14 main-container"
      {...createDynamicallyOpacityMotion(
        direction === ScrollDirection.up,
        VISIBLE_TRANSITION_MS,
      )}
    >
      <div className="container flex items-center justify-between h-full max-w-screen-md px-4 text-black md:px-8 dark:text-gray-300">
        <Logo />
        <HeaderDesktopNav />
        <div className="flex">
          <DarkModeButton />
          <HeaderMenu />
        </div>
      </div>
    </motion.header>
  );
};

export default memo(Header);
