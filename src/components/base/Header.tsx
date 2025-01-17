'use client';

import { memo } from 'react';

import { motion } from 'motion/react';

import DarkModeButton from './DarkModeButton';
import HeaderTitle from './HeaderTitle';
import Logo from './Logo';

const Header = () => {
  return (
    <motion.header className="fixed z-50 flex items-center w-full h-14 bg-inherit">
      <div className="container flex items-center h-full max-w-screen-md px-4 md:px-8 ">
        <Logo />
        <HeaderTitle />
        <DarkModeButton />
      </div>
    </motion.header>
  );
};

export default memo(Header);
