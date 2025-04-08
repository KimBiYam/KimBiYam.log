'use client';

import { memo } from 'react';

import { LazyMotion, domAnimation } from 'motion/react';
import * as m from 'motion/react-m';

import { Logo, DarkModeButton } from '@src/shared';

import HeaderTitle from './HeaderTitle';

const Header = () => {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.header className="fixed z-50 flex items-center w-full h-14 bg-inherit">
        <div className="container flex items-center h-full max-w-screen-md px-4 md:px-8 ">
          <Logo />
          <HeaderTitle />
          <DarkModeButton />
        </div>
      </m.header>
    </LazyMotion>
  );
};

export default memo(Header);
