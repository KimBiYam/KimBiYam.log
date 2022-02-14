import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeaderItem from './HeaderItem';
import HeaderMenu from './HeaderMenu';
import DarkModeButton from './DarkModeButton';
import favicon from '../../assets/favicon/favicon-192x192.png';

const Header = () => {
  return (
    <header className="fixed z-50 flex items-center w-full h-12 main-container">
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
            <HeaderItem href="/introduce" label="Introduce" />
          </div>
        </nav>
        <div className="flex">
          <DarkModeButton />
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
