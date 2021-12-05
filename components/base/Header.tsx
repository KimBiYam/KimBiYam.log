import { memo } from "react";
import Link from "next/link";
import HeaderItem from "./HeaderItem";
import HeaderMenu from "./HeaderMenu";
import DarkModeButton from "./DarkModeButton";

export type HeaderProps = {};

const Header = () => {
  return (
    <header className="fixed w-full h-12 z-50 flex items-center text-black dark:text-warmGray-400">
      <div className="container max-w-screen-md px-8 flex justify-between items-center">
        <nav className="flex items-center">
          <Link href="/">
            <a className="block lg:mt-0 font-bold">KimBiYam.log</a>
          </Link>
          <div className="ml-10 hidden md:flex">
            <HeaderItem href="/introduction" label="Introduction" />
            <HeaderItem href="/contact" label="Contact" />
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
