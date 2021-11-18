import { memo } from "react";
import Link from "next/link";
import HeaderItem from "./HeaderItem";
import HeaderMenu from "./HeaderMenu";

export type HeaderProps = {};

const Header = () => {
  return (
    <header className="fixed w-full h-8 flex items-center">
      <div className="container max-w-screen-md px-4 flex justify-between">
        <nav className="flex">
          <Link href="/">
            <a className="block lg:mt-0 font-bold">ChangHyun Kim</a>
          </Link>
          <div className="ml-10 hidden md:flex">
            <HeaderItem href="/introduction" label="Introduction" />
            <HeaderItem href="/contact" label="Contact" />
          </div>
        </nav>
        <HeaderMenu />
      </div>
    </header>
  );
};

export default memo(Header);
