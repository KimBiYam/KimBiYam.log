import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import HeaderItem from './HeaderItem';
import HeaderMenu from './HeaderMenu';
import DarkModeButton from './DarkModeButton';
import favicon from '../../assets/favicon/favicon-192x192.png';
import scrollState from '../../atoms/scrollState';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';
import { ScrollDirection } from '../../constants';

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
        <Link href="/" passHref>
          <button type="button" className="flex p-2">
            <Image
              src={favicon}
              alt="logo"
              width="24px"
              height="24px"
              quality={100}
              className="cursor-pointer "
            />
          </button>
        </Link>
        <nav className="flex items-center justify-end flex-1">
          <div className="hidden ml-4 font-bold md:block">
            <HeaderItem href="/contact" label="Contact" />
          </div>
        </nav>
        <div className="flex">
          <DarkModeButton />
          <HeaderMenu />
        </div>
      </div>
    </motion.header>
  );
};

export default memo(Header);
