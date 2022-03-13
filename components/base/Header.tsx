import { memo, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import HeaderItem from './HeaderItem';
import HeaderMenu from './HeaderMenu';
import DarkModeButton from './DarkModeButton';
import favicon from '../../assets/favicon/favicon-192x192.png';
import throttle from '../../lib/utils/throttle';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';
import headerVisibleState from '../../atoms/headerVisibleState';

const THROTTLE_TIME_MS = 100;
const VISIBLE_TRANSITION_MS = 100;

const Header = () => {
  const [isHeaderVisible, setIsHeaderVisible] =
    useRecoilState(headerVisibleState);
  const [pageY, setPageY] = useState(0);

  const handleScroll = useCallback(
    throttle(() => {
      const { pageYOffset } = window;
      const deltaY = pageYOffset - pageY;
      const isScrollUp = pageYOffset === 0 || deltaY < 0;

      setIsHeaderVisible(isScrollUp);
      setPageY(pageYOffset);
    }, THROTTLE_TIME_MS),
    [pageY, setIsHeaderVisible, setPageY],
  );

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [pageY]);

  return (
    <motion.header
      className="fixed z-50 flex items-center w-full h-12 main-container"
      {...createDynamicallyOpacityMotion(
        isHeaderVisible,
        VISIBLE_TRANSITION_MS,
      )}
    >
      <div className="container flex items-center justify-between max-w-screen-md px-8 text-black dark:text-gray-300">
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
