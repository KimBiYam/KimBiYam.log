import { memo } from 'react';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import scrollState from '../../atoms/scrollState';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';
import { ScrollDirection } from '../../constants';
import Logo from './Logo';
import HeaderDesktopNav from './HeaderDesktopNav';
import HeaderButtonSection from './HeaderButtonSection';

const VISIBLE_TRANSITION_MS = 100;
const HEADER_HEIGHT = 32;

const Header = () => {
  const { direction, pageY } = useRecoilValue(scrollState);

  const isShow = pageY < HEADER_HEIGHT / 2 || direction === ScrollDirection.up;

  return (
    <motion.header
      className="fixed z-50 flex items-center w-full h-14 main-container"
      {...createDynamicallyOpacityMotion(isShow, VISIBLE_TRANSITION_MS)}
    >
      <div className="container flex items-center justify-between h-full max-w-screen-md px-4 text-black md:px-8 dark:text-gray-300">
        <Logo />
        <HeaderDesktopNav />
        <HeaderButtonSection />
      </div>
    </motion.header>
  );
};

export default memo(Header);
